import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// Every field optional - PATCH-style partial update on top of create rules.
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
