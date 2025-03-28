import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender: string;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;
}
