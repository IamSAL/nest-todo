import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsNotEmpty()
  name: string;
  @ApiProperty({ description: 'The description of the task' })
  description: string;

  @ApiProperty({ description: 'The completion status of the task' })
  isCompleted: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ description: 'The ID of the category' })
  categoryId: number;
}
