import {
    BaseEntity,
    Column,
    Entity,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
 import {User} from '../../users/entities/user.entity';
  
  @Entity('roles')
  export class Role extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ type: 'varchar', length: 20, nullable: false })
    name: string;
    @Column({ type: 'text', nullable: false })
    descripcion: string;
    @ManyToMany(() => User, (user) => user.roles)
    users: User[];
  
    @Column({ type: 'varchar', default: 'ACTIVE', length: 8 })
    status: string;
    @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
    createdAt: Date;
  
    @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
    updatedAt: Date;
  }