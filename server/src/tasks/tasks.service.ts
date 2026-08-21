import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { WeatherService } from '../weather/weather.service';
import { UploadService } from '../upload/upload.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

interface AuthedUser {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly weather: WeatherService,
    private readonly upload: UploadService,
  ) {}

  async create(user: AuthedUser, dto: CreateTaskDto, file?: Express.Multer.File) {
    let attachmentUrl: string | undefined;
    let attachmentName: string | undefined;

    if (file) {
      const uploaded = await this.upload.uploadFile(file);
      attachmentUrl = uploaded.secure_url;
      attachmentName = file.originalname;
    }

    const task = await this.prisma.task.create({
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        attachmentUrl,
        attachmentName,
        userId: user.id,
      },
    });

    // Fire-and-forget - the caller shouldn't wait on SMTP round trips
    // before getting their "task created" response back.
    this.mail.sendTaskCreated(user.email, user.name, task.title).catch(() => undefined);

    return this.attachWeather(task);
  }

  async findAll(user: AuthedUser, query: QueryTasksDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';
    const { status, priority, search, startDate, endDate } = query;

    const where: Prisma.TaskWhereInput = { userId: user.id };

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate);
      if (endDate) where.dueDate.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orderBy: Prisma.TaskOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [tasks, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const tasksWithWeather = await Promise.all(
      tasks.map((task: Prisma.TaskGetPayload<object>) => this.attachWeather(task)),
    );

    return {
      tasks: tasksWithWeather,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async findOne(user: AuthedUser, id: string) {
    const task = await this.getOwnedTaskOrThrow(user.id, id);
    return this.attachWeather(task);
  }

  async update(user: AuthedUser, id: string, dto: UpdateTaskDto, file?: Express.Multer.File) {
    const existing = await this.getOwnedTaskOrThrow(user.id, id);

    let attachmentUrl = existing.attachmentUrl;
    let attachmentName = existing.attachmentName;

    if (file) {
      const uploaded = await this.upload.uploadFile(file);
      attachmentUrl = uploaded.secure_url;
      attachmentName = file.originalname;
    }

    const wasAlreadyDone = existing.status === TaskStatus.DONE;
    const isNowDone = dto.status === TaskStatus.DONE;

    const task = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        attachmentUrl,
        attachmentName,
      },
    });

    // Only notify on the transition into DONE, not every subsequent edit
    // of an already-completed task.
    if (isNowDone && !wasAlreadyDone) {
      this.mail.sendTaskCompleted(user.email, user.name, task.title).catch(() => undefined);
    }

    return this.attachWeather(task);
  }

  async remove(user: AuthedUser, id: string) {
    await this.getOwnedTaskOrThrow(user.id, id);
    await this.prisma.task.delete({ where: { id } });
    return { id };
  }

  private async getOwnedTaskOrThrow(userId: string, taskId: string) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    if (task.userId !== userId) {
      // 403 rather than 404 would leak whether the id exists at all for
      // someone probing sequential ids - NotFound-shaped response either way.
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  private async attachWeather<T extends { location?: string | null }>(task: T) {
    const weather = await this.weather.getByLocation(task.location ?? undefined);
    return { ...task, weather };
  }
}
