import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  description: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
