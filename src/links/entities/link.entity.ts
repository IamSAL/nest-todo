import { User } from 'src/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string;

  @Column()
  url: string;

  @Column()
  iconUrl: string;

  @ManyToOne(() => User, (user) => user.links)
  user: User;
}
