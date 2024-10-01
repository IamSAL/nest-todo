import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(
    createTaskDto: CreateTaskDto,
  ): Promise<{ message: string; task: Task }> {
    const category = await this.categoriesRepository.findOneBy({
      id: createTaskDto.categoryId,
    });
    console.log({ category, createTaskDto });
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createTaskDto.categoryId} not found`,
      );
    }
    const task = this.tasksRepository.create({ ...createTaskDto, category });
    await this.tasksRepository.save(task);
    return { message: 'Task created successfully', task };
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
  }

  async findAllByCategoryId(categoryId: number): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { category: { id: categoryId } },
    });
    if (tasks.length === 0) {
      throw new NotFoundException(
        `No tasks found for category ID ${categoryId}`,
      );
    }
    return tasks;
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<{ message: string; task: Task }> {
    const task = await this.tasksRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (updateTaskDto.categoryId) {
      const category = await this.categoriesRepository.findOneBy({
        id: updateTaskDto.categoryId,
      });
      if (!category) {
        throw new NotFoundException(
          `Category with ID ${updateTaskDto.categoryId} not found`,
        );
      }
      task.category = category;
    }
    Object.assign(task, updateTaskDto);
    await this.tasksRepository.save(task);
    return { message: 'Task updated successfully', task };
  }

  async remove(id: number): Promise<{ message: string }> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: 'Task removed successfully' };
  }
}
