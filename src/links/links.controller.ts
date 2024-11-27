import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';

@ApiTags('links')
@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  @ApiResponse({
    status: 201,
    description: 'The link has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createLinkDto: CreateLinkDto, @Request() req) {
    const user: User = req.user;
    return this.linksService.create(createLinkDto, user);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple links' })
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  @ApiResponse({
    status: 201,
    description: 'The links have been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({
    type: [CreateLinkDto],
    examples: {
      example1: {
        summary: 'Example of multiple links',
        value: [
          {
            platform: 'YouTube',
            url: 'https://example.com',
            iconUrl: 'https://example.com/icon.png',
          },
          {
            platform: 'FB',
            url: 'https://example.com',
            iconUrl: 'https://example.com/icon.png',
          },
        ],
      },
    },
  })
  createBulk(@Body() createLinkDtos: CreateLinkDto[], @Request() req) {
    const user: User = req.user;
    return this.linksService.createBulk(createLinkDtos, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all links of the current user' })
  @ApiResponse({
    status: 200,
    description: 'Return all links of the current user.',
  })
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  findAllByUser(@Request() req) {
    const userId = req.user.id;
    return this.linksService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a link by ID' })
  @ApiResponse({ status: 200, description: 'Return a link by ID.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a link by ID' })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link by ID' })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  remove(@Param('id') id: string) {
    return this.linksService.remove(id);
  }
}
