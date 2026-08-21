import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MailModule } from '../mail/mail.module';
import { WeatherModule } from '../weather/weather.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [MailModule, WeatherModule, UploadModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
