import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { taskCreatedTemplate } from './templates/task-created.template';
import { taskCompletedTemplate } from './templates/task-completed.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    this.from = this.config.get<string>('mail.from') ?? 'Task Manager <no-reply@example.com>';
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mail.host'),
      port: this.config.get<number>('mail.port'),
      secure: false, // STARTTLS on port 587
      auth: {
        user: this.config.get<string>('mail.user'),
        pass: this.config.get<string>('mail.pass'),
      },
    });
  }

  async sendTaskCreated(to: string, userName: string, taskTitle: string) {
    const { subject, html } = taskCreatedTemplate(userName, taskTitle);
    await this.send(to, subject, html);
  }

  async sendTaskCompleted(to: string, userName: string, taskTitle: string) {
    const { subject, html } = taskCompletedTemplate(userName, taskTitle);
    await this.send(to, subject, html);
  }

  // Notifications are a nice-to-have on top of the core task operation -
  // if SMTP is down or misconfigured we log it and move on rather than
  // failing the whole create/update request.
  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}: ${error.message}`);
    }
  }
}
