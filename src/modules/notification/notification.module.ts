import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { DatabaseModule } from 'src/database/database.module';
import { NotificationProviders } from './notification.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
  providers: [NotificationService, ...NotificationProviders],
  exports: [NotificationService],
})
export class NotificationModule {}
