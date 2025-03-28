import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity()
export class CommunityPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.communityPosts)
  user: User; // Usuario que publica.


  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;
}

