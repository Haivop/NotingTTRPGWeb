// src/users/users.controller.ts

import { Body, Controller, Patch, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';

// ❌ Видаляємо імпорт 'Response' та декоратор @Res(), оскільки використовуємо стандартний підхід NestJS

@Controller('users') // Базовий шлях: /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. ОНОВЛЕННЯ ПРОФІЛЮ (PATCH /users/me)
  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() payload: JwtPayload, @Body() dto: UpdateUserDto) {
    // payload.sub містить ID поточного користувача
    const updated = await this.usersService.update(payload.sub, dto);

    // Повертаємо DTO з оновленими даними. NestJS автоматично встановлює статус 200 OK.
    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
    };
  }

  // ---

  // 2. ПЕРЕВІРКА ІСНУВАННЯ КОРИСТУВАЧА (GET /users/check-existence?email=...)
  @Get('check-existence')
  // Використовуємо @Query('email') для отримання параметра
  async checkExistenceByEmail(
    @Query('email') email: string, // Отримуємо email з query-параметрів
  ) {
    // ⚠️ NestJS автоматично обробляє помилки.
    // Якщо email не надано, краще використати Pipe (наприклад, ValidationPipe)
    // або кинути виняток NestJS.
    if (!email) {
      // Викидаємо стандартний BadRequestException, щоб NestJS обробив його коректно
      throw new Error('Email query parameter is required.');
      // Або (рекомендовано, якщо у вас є імпорт)
      // throw new BadRequestException('Email query parameter is required.');
    }

    const exists = await this.usersService.checkExistenceByEmail(email);

    // ✅ Повертаємо об'єкт. NestJS автоматично встановлює Status 200 OK
    // та серіалізує об'єкт у JSON: { "exists": true/false }
    return {
      exists: exists,
    };
  }
}
