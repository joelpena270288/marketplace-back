import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { GetMessagesDto } from './dto/get-message.dto';

// DTO para crear un mensaje


// DTO para paginación de mensajes


@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post()
  async createMessage(@Body() body: CreateMessageDto): Promise<Message> {
    try {
      return await this.messagesService.createMessage(
        body.sender,
        body.message,
      );
    } catch (error) {
      console.error('Error al crear el mensaje:', error.message);
      throw new BadRequestException('No se pudo crear el mensaje.');
    }
  }

  @Get()
  async getMessages(@Query() query: GetMessagesDto): Promise<{ messages: Message[]; total: number }> {
    try {
      const { page = 1, pageSize = 20 } = query; // Valores predeterminados si no se pasan parámetros
      return await this.messagesService.getAllMessages(page, pageSize);
    } catch (error) {
      console.error('Error al obtener los mensajes:', error.message);
      throw new BadRequestException('No se pudieron cargar los mensajes.');
    }
  }
}

