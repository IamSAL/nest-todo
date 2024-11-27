import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  async getPublicProfile(userName: string) {
    const user = await this.userRepository.findOne({
      where: { username: userName },
      relations: ['links'],
    });
    console.log({ userName, user });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.isPublished) {
      throw new NotFoundException('User profile is not published');
    }

    const { password, ...userProfile } = user;
    return userProfile;
  }

  async getFullProfile(userId: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['links'],
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userProfile } = user;
    return userProfile;
  }
  async updateProfile(id: any, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // if (updateUserDto.password) {
    //   const salt = await bcrypt.genSalt();
    //   updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    // }

    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOne({ where: { id } });
    delete updatedUser.password;

    return updatedUser;
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ApiConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;

    return savedUser;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username: user.username, sub: user.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.authConfig.privateKey,
        expiresIn: '15m',
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.authConfig.privateKey,
        expiresIn: '7d',
      });

      await this.updateRefreshToken(user.id, refreshToken);

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
      };
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.authConfig.privateKey,
      expiresIn: '15m',
    });

    return {
      access_token: accessToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, {
      refreshToken: null,
    });
  }
}
