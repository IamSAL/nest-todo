import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    const category = await this.categoryRepository.save(newCategory);
    return { message: 'Category created successfully', category };
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['tasks'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ message: string; category: Category }> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    Object.assign(category, updateCategoryDto);
    await this.categoryRepository.save(category);
    return { message: 'Category updated successfully', category };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return { message: 'Category deleted successfully' };
  }
}
