import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Додаємо ConfigModule в імпорти
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Беремо секрет із ConfigService
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService], // Інжектуємо ConfigService
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,],
})
export class AuthModule {}