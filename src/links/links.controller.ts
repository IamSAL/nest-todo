import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('links')
@Controller('links')
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new link' })
  @ApiResponse({
    status: 201,
    description: 'The link has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all links' })
  @ApiResponse({ status: 200, description: 'Return all links.' })
  findAll() {
    return this.linksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a link by ID' })
  @ApiResponse({ status: 200, description: 'Return a link by ID.' })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  findOne(@Param('id') id: string) {
    return this.linksService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a link by ID' })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  update(@Param('id') id: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.linksService.update(+id, updateLinkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a link by ID' })
  @ApiResponse({
    status: 200,
    description: 'The link has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Link not found.' })
  remove(@Param('id') id: string) {
    return this.linksService.remove(+id);
  }
}
