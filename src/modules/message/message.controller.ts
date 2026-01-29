import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/user.decorator';
import { User } from '../users/entities/user.entity';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-message.dto';

// DTO para crear un mensaje

// DTO para paginación de mensajes

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  // Simple per-user rate limiter for HTTP endpoint
  private rateMap = new Map<string, number[]>();

  constructor(private readonly messagesService: MessageService) {}

  @Post()
  async createMessage(
    @GetUser() user: User,
    @Body() body: CreateMessageDto,
  ): Promise<Message> {
    try {
      // Rate limit: max 30 messages per minute per user
      const userId = String(user?.id ?? 'anonymous');
      const now = Date.now();
      const windowMs = 60_000;
      const max = 30;
      const arr = this.rateMap.get(userId) ?? [];
      const recent = arr.filter((t) => now - t < windowMs);
      if (recent.length >= max) {
        throw new BadRequestException('Too many requests - slow down');
      }
      recent.push(now);
      this.rateMap.set(userId, recent);

      // Use the authenticated user's username to avoid spoofing
      const sender = user?.username ?? 'Desconocido';
      return await this.messagesService.createMessage(
        sender,
        body.message,
        body.channel,
      );
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error al crear el mensaje:', msg);
      throw new BadRequestException('No se pudo crear el mensaje.');
    }
  }

  @Get()
  async getMessages(
    @Query() query: GetMessagesDto,
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const { page = 1, pageSize = 20 } = query; // Valores predeterminados si no se pasan parámetros
      return await this.messagesService.getAllMessages(page, pageSize);
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      console.error('Error al obtener los mensajes:', msg);
      throw new BadRequestException('No se pudieron cargar los mensajes.');
    }
  }
}
