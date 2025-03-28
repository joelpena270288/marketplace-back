import { Inject, Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_REPOSITORY')
    private notificationRepo: Repository<Notification>,
  ) {}
  async createNotification(userId: string, message: string) {
    const notification = this.notificationRepo.create({ userId, message });
    return await this.notificationRepo.save(notification);
  }

  async getUserNotifications(userId: string) {
    return await this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
