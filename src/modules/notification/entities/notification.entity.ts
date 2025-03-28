import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string; // ID del usuario que recibe la notificación

  @Column()
  message: string; // Contenido de la notificación

  @CreateDateColumn()
  createdAt: Date;
}
