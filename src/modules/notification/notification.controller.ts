import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationService } from './notification.service';


@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return await this.notificationService.getUserNotifications(userId);
  }
}
