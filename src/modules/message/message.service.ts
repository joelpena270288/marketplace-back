import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
  Inject as NestInject,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from '../conversation/entities/conversation.entity';
import { ChatGateway } from '../chat/chat.gateway';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: Repository<Message>,
    @NestInject(forwardRef(() => ChatGateway))
    private readonly chatGateway?: ChatGateway,
  ) {}

  // 🔹 Obtener mensajes con paginación y total de mensajes
  async getAllMessages(
    page = 1,
    pageSize = 20,
  ): Promise<{ messages: Message[]; total: number }> {
    try {
      const [messages, total] = await this.messageRepository.findAndCount({
        order: { timestamp: 'ASC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return { messages, total };
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error('Error al obtener mensajes:', msg);
      throw new Error('No se pudieron cargar los mensajes');
    }
  }

  // 🔹 Buscar mensaje por contenido y remitente
  async findMessageByContent(
    username: string,
    message: string,
  ): Promise<Message | null> {
    try {
      return await this.messageRepository.findOne({
        where: { sender: username, message },
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error(`Error al buscar mensaje de ${username}:`, msg);
      throw new Error('No se pudo buscar el mensaje');
    }
  }

  // 🔹 Crear un mensaje nuevo
  async createMessage(
    username: string,
    message: string,
    channel?: string,
    conversation?: Conversation | null,
  ): Promise<Message> {
    try {
      // Evitar mensajes duplicados
      const existingMessage = await this.findMessageByContent(
        username,
        message,
      );
      if (existingMessage) {
        this.logger.warn(
          `Mensaje duplicado detectado de ${username}: "${message}"`,
        );
        return existingMessage;
      }

      // Crear el nuevo mensaje
      const newMessage = this.messageRepository.create({
        sender: username,
        message,
        timestamp: new Date().toISOString(),
        channel: channel ?? null,
        conversation: conversation ?? null,
      });

      const savedMessage = await this.messageRepository.save(newMessage);
      this.logger.log(
        `Mensaje guardado exitosamente: ${JSON.stringify(savedMessage)}`,
      );
      // Note: realtime emission is handled by ChatGateway to avoid double
      // emitting when messages are created via a socket event. MessageService
      // only persists the message and logs the result.

      return savedMessage;
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : JSON.stringify(error);
      this.logger.error('Error al guardar mensaje:', msg);
      throw new Error('No se pudo guardar el mensaje');
    }
  }
}
