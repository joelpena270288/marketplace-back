import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../../role/entities/role.entity';
import { UserDetails } from '../user.details.entity';
import { Status } from '../../../EntityStatus/entity.estatus.enum';
import { CommunityPost } from '../../comunity-post/entities/comunity-post.entity';
import { Comment } from '../../comment/entities/comment.entity'
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'varchar', unique: true, length: 25, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
  @OneToOne((type) => UserDetails, {
    cascade: true,
    nullable: false,
    eager: true,
  })
  @JoinColumn({ name: 'detail_id' })
  details: UserDetails;

  @ManyToMany((type) => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles: Role[];
  @Column({ type: 'varchar', default: Status.ACTIVO, length: 10 })
  status: string;
  @OneToMany(() => CommunityPost, (comunity) => comunity.user)
  communityPosts: CommunityPost[];
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
  @CreateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
