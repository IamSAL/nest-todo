import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  MaxLength,
  IsUrl,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email', required: false })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ description: 'First name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  first_name?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  last_name?: string;

  @ApiProperty({ description: 'Bio', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(768)
  bio?: string;

  @ApiProperty({ description: 'Published or not', required: false })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({ description: 'Profile picture URL', required: false })
  @IsOptional()
  @IsUrl()
  profile_picture_url?: string;
}
