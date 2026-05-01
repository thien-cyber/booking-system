import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: any) {
    const userExists = await this.usersService.findByEmail(registerDto.email);
    if (userExists) throw new HttpException('Email đã được sử dụng', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.create({ ...registerDto, password: hashedPassword });

    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: any) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new HttpException('Email hoặc mật khẩu không đúng', HttpStatus.UNAUTHORIZED);

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) throw new HttpException('Email hoặc mật khẩu không đúng', HttpStatus.UNAUTHORIZED);

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role }
    };
  }
}