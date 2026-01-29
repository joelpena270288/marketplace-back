import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Conversation } from '../../conversation/entities/conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // username of sender (we don't store full user object here to keep previous contract)
  @Column()
  sender: string;

  @Column()
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  channel?: string | null;

  @ManyToOne(() => Conversation, (c) => c.messages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'conversation_id' })
  conversation?: Conversation | null;
}
