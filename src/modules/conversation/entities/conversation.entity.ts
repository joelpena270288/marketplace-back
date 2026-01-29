import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  Column,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../message/entities/message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isGroup: boolean;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: 'conversation_participants' })
  participants: User[];

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
