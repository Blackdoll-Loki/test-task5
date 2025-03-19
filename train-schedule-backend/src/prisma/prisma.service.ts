// src/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Виконуємо підключення до БД
    await this.$connect();
  }

  // Можна додати свої методи для роботи з базою даних тут
}