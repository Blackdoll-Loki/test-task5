import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async generateToken(userId: string) {
    const secret = this.configService.get<string>('JWT_SECRET');
    return this.jwtService.sign({ userId }, { secret });
  }
}