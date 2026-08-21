import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { WeatherService } from '../weather/weather.service';
import { UploadService } from '../upload/upload.service';

describe('TasksService', () => {
  let tasksService: TasksService;
  let prisma: any;
  let mail: { sendTaskCreated: jest.Mock; sendTaskCompleted: jest.Mock };
  let weather: { getByLocation: jest.Mock };

  const owner = { id: 'user-1', name: 'Pat', email: 'pat@example.com' };
  const otherUser = { id: 'user-2', name: 'Alex', email: 'alex@example.com' };

  const sampleTask = {
    id: 'task-1',
    title: 'Water the plants',
    status: 'PENDING',
    priority: 'LOW',
    location: 'Hyderabad',
    userId: owner.id,
  };

  beforeEach(async () => {
    prisma = {
      task: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn((queries) => Promise.all(queries)),
    };

    mail = {
      sendTaskCreated: jest.fn().mockResolvedValue(undefined),
      sendTaskCompleted: jest.fn().mockResolvedValue(undefined),
    };

    weather = { getByLocation: jest.fn().mockResolvedValue(null) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailService, useValue: mail },
        { provide: WeatherService, useValue: weather },
        { provide: UploadService, useValue: { uploadFile: jest.fn() } },
      ],
    }).compile();

    tasksService = moduleRef.get(TasksService);
  });

  it('creates a task scoped to the requesting user and sends a confirmation email', async () => {
    prisma.task.create.mockResolvedValue(sampleTask);

    const result = await tasksService.create(owner, { title: sampleTask.title });

    expect(prisma.task.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ userId: owner.id }) }),
    );
    expect(mail.sendTaskCreated).toHaveBeenCalledWith(owner.email, owner.name, sampleTask.title);
    expect(result).toMatchObject({ id: sampleTask.id, weather: null });
  });

  it('rejects access to a task owned by a different user', async () => {
    prisma.task.findUnique.mockResolvedValue(sampleTask);

    await expect(tasksService.findOne(otherUser, sampleTask.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('throws NotFound for a task id that does not exist', async () => {
    prisma.task.findUnique.mockResolvedValue(null);

    await expect(tasksService.findOne(owner, 'missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('sends a completion email only on the PENDING/IN_PROGRESS -> DONE transition', async () => {
    prisma.task.findUnique.mockResolvedValue(sampleTask);
    prisma.task.update.mockResolvedValue({ ...sampleTask, status: 'DONE' });

    await tasksService.update(owner, sampleTask.id, { status: 'DONE' } as any);

    expect(mail.sendTaskCompleted).toHaveBeenCalledTimes(1);
  });

  it('does not re-send the completion email if the task was already done', async () => {
    const doneTask = { ...sampleTask, status: 'DONE' };
    prisma.task.findUnique.mockResolvedValue(doneTask);
    prisma.task.update.mockResolvedValue(doneTask);

    await tasksService.update(owner, sampleTask.id, { status: 'DONE' } as any);

    expect(mail.sendTaskCompleted).not.toHaveBeenCalled();
  });

  it('paginates and returns meta alongside the task list', async () => {
    prisma.task.findMany.mockResolvedValue([sampleTask]);
    prisma.task.count.mockResolvedValue(1);

    const result = await tasksService.findAll(owner, {
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    } as any);

    expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, lastPage: 1 });
    expect(result.tasks).toHaveLength(1);
  });
});
