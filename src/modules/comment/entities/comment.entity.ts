import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CommunityPost } from '../../comunity-post/entities/comunity-post.entity';

@Entity('coments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User; // Usuario que comenta.

  @ManyToOne(() => CommunityPost, (post) => post.comments)
  post: CommunityPost;

  @CreateDateColumn()
  createdAt: Date;
}
