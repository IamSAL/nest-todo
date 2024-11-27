import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        access_token: 'jwt_token_here',
        refresh_token: 'refresh_token_here',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    schema: {
      example: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Software developer',
        profile_picture_url: 'http://example.com/profile.jpg',
        role: 'USER',
      },
    },
  })
  getProfile(@Request() req) {
    const userId = req.user.id;
    return this.authService.getFullProfile(userId);
  }

  @Get('public-profile')
  @ApiOperation({ summary: 'Get public user profile' })
  @ApiQuery({
    name: 'userName',
    required: true,
    description: 'Username of the user',
    schema: {
      example: 'johndoe',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved',
    schema: {
      example: {
        id: 1,
        username: 'johndoe',
        email: 'johndoe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Software developer',
        profile_picture_url: 'http://example.com/profile.jpg',
        role: 'USER',
        links: [
          {
            id: 1,
            platform: 'YouTube',
            url: 'https://example.com',
            icon_url: 'https://example.com/icon.png',
          },
        ],
      },
    },
  })
  getPublicProfile(@Query() param: any) {
    return this.authService.getPublicProfile(param.userName);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/update')
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateProfile(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth() // Indicates that this endpoint requires a bearer token
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(@Request() req) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout successful' };
  }
}
