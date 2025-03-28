import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    @Inject('MESSAGE_REPOSITORY')
    private readonly messageRepository: Repository<Message>,
  ) {}

  // 🔹 Obtener mensajes con paginación y total de mensajes
  async getAllMessages(page = 1, pageSize = 20): Promise<{ messages: Message[]; total: number }> {
    try {
      const [messages, total] = await this.messageRepository.findAndCount({
        order: { timestamp: 'ASC' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      return { messages, total };
    } catch (error) {
      this.logger.error('Error al obtener mensajes:', error.message);
      throw new Error('No se pudieron cargar los mensajes');
    }
  }

  // 🔹 Buscar mensaje por contenido y remitente
  async findMessageByContent(username: string, message: string): Promise<Message | null> {
    try {
      return await this.messageRepository.findOne({
        where: { sender: username, message },
      });
    } catch (error) {
      this.logger.error(`Error al buscar mensaje de ${username}:`, error.message);
      throw new Error('No se pudo buscar el mensaje');
    }
  }

  // 🔹 Crear un mensaje nuevo
  async createMessage(username: string, message: string): Promise<Message> {
    try {
      // Evitar mensajes duplicados
      const existingMessage = await this.findMessageByContent(username, message);
      if (existingMessage) {
        this.logger.warn(`Mensaje duplicado detectado de ${username}: "${message}"`);
        return existingMessage;
      }

      // Crear el nuevo mensaje
      const newMessage = this.messageRepository.create({
        sender: username,
        message,
        timestamp: new Date().toISOString(),
      });

      const savedMessage = await this.messageRepository.save(newMessage);
      this.logger.log(`Mensaje guardado exitosamente: ${JSON.stringify(savedMessage)}`);
      return savedMessage;
    } catch (error) {
      this.logger.error('Error al guardar mensaje:', error.message);
      throw new Error('No se pudo guardar el mensaje');
    }
  }
}
