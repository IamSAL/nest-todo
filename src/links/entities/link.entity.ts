import { Task } from 'src/tasks/entities/task.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  platform: string;
  @Column()
  url: string;
  @Column()
  iconUrl: string;
}
