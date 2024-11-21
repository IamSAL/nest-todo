import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({
    description: 'The platform of the link',
    example: 'YouTube',
  })
  @IsNotEmpty()
  @IsString()
  platform: string;

  @ApiProperty({
    description: 'The URL of the link',
    example: 'https://example.com',
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'The icon URL of the link',
    example: 'https://example.com/icon.png',
  })
  @IsNotEmpty()
  @IsUrl()
  iconUrl: string;
}
