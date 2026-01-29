import { Controller, Get, Param, UseGuards, Query, BadRequestException, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationService } from './conversation.service';
import { MessageService } from '../message/message.service';
import { GetUser } from '../auth/user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly usersService: UsersService,
    private readonly messagesService: MessageService,
  ) {}

  @Get(':id')
  async getConversation(@Param('id') id: string) {
    try {
      const conv = await this.conversationService.findById(id);
      if (!conv) throw new BadRequestException('Conversation not found');
      return conv;
    } catch (err) {
      throw new BadRequestException('Could not load conversation');
    }
  }

  @Post('direct')
  async getOrCreateDirect(
    @GetUser() user: User,
    @Body() body: { recipientId: string },
  ) {
    try {
      const recipient = await this.usersService.findById(body.recipientId);
      if (!recipient) throw new BadRequestException('Recipient not found');
      const conv = await this.conversationService.createDirectConversation(user as any, recipient as any);
      return conv;
    } catch (err) {
      throw new BadRequestException('Could not create or fetch conversation');
    }
  }

  @Post(':id/messages')
  async postMessageToConversation(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: { message: string },
  ) {
    try {
      const conv = await this.conversationService.findById(id);
      if (!conv) throw new BadRequestException('Conversation not found');
      // use username from authenticated user to avoid spoofing
      const sender = user.username ?? 'Unknown';
      const saved = await this.messagesService.createMessage(sender, body.message, undefined, conv);
      return saved;
    } catch (err) {
      throw new BadRequestException('Could not post message');
    }
  }
}
