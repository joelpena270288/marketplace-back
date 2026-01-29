import { Module, forwardRef } from '@nestjs/common';
import { conversationProviders } from './conversation.providers';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { UsersModule } from '../users/users.module';
import { DatabaseModule } from '../../database/database.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [forwardRef(() => UsersModule), DatabaseModule, forwardRef(() => MessageModule)],
  providers: [ConversationService, ...conversationProviders],
  controllers: [ConversationController],
  exports: [ConversationService],
})
export class ConversationModule {}
