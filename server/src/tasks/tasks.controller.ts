import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

// Everything here is per-user - the guard establishes identity, the
// service enforces ownership on every read/write against that id.
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment'))
  create(
    @CurrentUser() user: any,
    @Body() dto: CreateTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.tasksService.create(user, dto, file);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(user, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(user, id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('attachment'))
  update(
    @CurrentUser() user: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaskDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.tasksService.update(user, id, dto, file);
  }

  @Delete(':id')
  remove(@CurrentUser() user: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(user, id);
  }
}
