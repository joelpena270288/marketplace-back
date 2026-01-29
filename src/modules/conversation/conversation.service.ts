import { Inject, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConversationService {
  private readonly logger = new Logger(ConversationService.name);

  constructor(
    @Inject('CONVERSATION_REPOSITORY')
    private readonly conversationRepository: Repository<Conversation>,
  ) {}

  // Busca conversación directa entre dos usuarios (sin importar orden)
  async findDirectConversationBetween(
    aId: string,
    bId: string,
  ): Promise<Conversation | null> {
    try {
      const convs = await this.conversationRepository
        .createQueryBuilder('c')
        .leftJoinAndSelect('c.participants', 'p')
        .where('c.isGroup = :isGroup', { isGroup: false })
        .getMany();

      for (const c of convs) {
        const ids = c.participants.map((p) => p.id);
        if (ids.includes(aId) && ids.includes(bId) && ids.length === 2) {
          return c;
        }
      }
      return null;
    } catch (err) {
      this.logger.error('Error buscando conversaciones directas', err as any);
      return null;
    }
  }

  async createDirectConversation(a: User, b: User): Promise<Conversation> {
    const existing = await this.findDirectConversationBetween(a.id, b.id);
    if (existing) return existing;

    const conv = this.conversationRepository.create({
      isGroup: false,
      participants: [a, b],
    });
    return await this.conversationRepository.save(conv);
  }

  async findById(id: string): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: { id },
      relations: ['participants', 'messages'],
    });
  }
}
