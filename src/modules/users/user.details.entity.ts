import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('user_details')
  export class UserDetails extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;  
    @Column({ type: 'varchar', length: 50, nullable: true })
    name: string;  
    @Column({ type: 'varchar', nullable: true })
    lastname: string;
	 @Column({ type: 'varchar', nullable: true })
     email: string; 
  
  
    @CreateDateColumn({ type: 'timestamp', name: 'created_at', nullable: true })
    createdAt: Date;
    @CreateDateColumn({ type: 'timestamp', name: 'updated_at', nullable: true })
    updatedAt: Date;
  }