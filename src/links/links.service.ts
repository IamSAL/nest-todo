import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from './entities/link.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linkRepository: Repository<Link>,
  ) {}

  async create(
    createLinkDto: CreateLinkDto,
  ): Promise<{ message: string; link: Link }> {
    const newLink = this.linkRepository.create(createLinkDto);
    const link = await this.linkRepository.save(newLink);
    return { message: 'Link created successfully', link };
  }

  async findAll(): Promise<Link[]> {
    return this.linkRepository.find();
  }

  async findOne(id: number): Promise<Link> {
    const link = await this.linkRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    return link;
  }

  async update(
    id: number,
    updateLinkDto: UpdateLinkDto,
  ): Promise<{ message: string; link: Link }> {
    const link = await this.linkRepository.findOneBy({ id });
    if (!link) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    Object.assign(link, updateLinkDto);
    await this.linkRepository.save(link);
    return { message: 'Link updated successfully', link };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.linkRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Link with ID ${id} not found`);
    }
    return { message: 'Link deleted successfully' };
  }
}
