import { Body, Controller, Patch, UseGuards, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@CurrentUser() payload: JwtPayload, @Body() dto: UpdateUserDto) {
    const updated = await this.usersService.update(payload.sub, dto);

    return {
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      createdAt: updated.createdAt,
    };
  }

  @Get('check-existence')
  async checkExistenceByEmail(@Query('email') email: string) {
    if (!email) {
      throw new Error('Email query parameter is required.');
    }

    const exists = await this.usersService.checkExistenceByEmail(email);

    return {
      exists: exists,
    };
  }
}
