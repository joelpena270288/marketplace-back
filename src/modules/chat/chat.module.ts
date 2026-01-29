import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

import { MessageModule } from '../message/message.module';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  providers: [ChatGateway],
  imports: [
    forwardRef(() => MessageModule),
    forwardRef(() => UsersModule),
  forwardRef(() => ConversationModule),
    forwardRef(() => NotificationModule),
  ],
  exports: [ChatGateway],
})
export class ChatModule {}
