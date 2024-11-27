import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Link } from 'src/links/entities/link.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column('varchar', { length: 255, unique: false, nullable: true })
  email?: string;

  @Column('varchar', { length: 255, nullable: true })
  first_name?: string;

  @Column('varchar', { length: 255, nullable: true })
  last_name?: string;

  @Column('varchar', { length: 768, nullable: true })
  bio?: string;

  @Column({ nullable: true })
  profile_picture_url?: string;

  @Column({ nullable: true, default: false })
  isPublished?: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  @ApiProperty({
    enum: Role,
    default: Role.USER,
    description: 'User role',
  })
  role: Role;

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];

  @Column({ nullable: true })
  refreshToken: string;
}
