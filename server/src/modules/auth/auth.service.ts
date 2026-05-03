import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(registerDto.email);
    if (userExists)
      throw new HttpException('Email đã được sử dụng', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user)
      throw new HttpException(
        'Email hoặc mật khẩu không đúng',
        HttpStatus.UNAUTHORIZED,
      );

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatching)
      throw new HttpException(
        'Email hoặc mật khẩu không đúng',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = { sub: user.id, email: user.email, role: user.role };

    // 1. Tạo Access Token (Ngắn hạn - vd: 15 phút)
    const access_token = this.jwtService.sign(payload, {
      expiresIn: (process.env.JWT_EXPIRATION || '15m') as any,
    });

    // 2. Tạo Refresh Token (Dài hạn - vd: 7 ngày)
    const refresh_token = this.jwtService.sign(payload, {
      secret:
        process.env.JWT_REFRESH_SECRET || 'mot_chuoi_bi_mat_cho_refresh_token',
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    };
  }

  // Hàm mới: Xác thực Refresh Token và cấp lại Access Token
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret:
          process.env.JWT_REFRESH_SECRET ||
          'mot_chuoi_bi_mat_cho_refresh_token',
      });
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) throw new Error('User not found');

      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: (process.env.JWT_EXPIRATION || '15m') as any,
      });

      return { access_token };
    } catch (e) {
      throw new HttpException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
