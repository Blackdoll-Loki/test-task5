import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    console.log('body', body);

    const hashedPassword = await this.authService.hashPassword(body.password);

    console.log('hashedPassword', hashedPassword)
    await prisma.user.create({
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
    console.log('user', user)
    if (!user || !(await this.authService.comparePasswords(body.password, user.password))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const token = await this.authService.generateToken(user.id);
    return res.status(HttpStatus.OK).json({ token });
  }

  private async findUserByUsername(email: string) {
    console.log('login request prisma')
    return await prisma.user.findUnique({ where: { email } });
  }
}
