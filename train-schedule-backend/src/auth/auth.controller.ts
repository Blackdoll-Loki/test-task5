import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    const hashedPassword = await this.authService.hashPassword(body.password);
    PrismaService.user.create({
        data: {
            email: body.email, 
            password: hashedPassword,
        },
      });
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Res() res) {
    const user = await this.findUserByUsername(body.email); 
    if (!user || !(await this.authService.comparePasswords(body.password, user.password))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const token = await this.authService.generateToken(user.id);
    return res.status(HttpStatus.OK).json({ token });
  }

  private async findUserByUsername(email: string) {
    return PrismaService.user.findUnique({ where: { email } });
  }
}
