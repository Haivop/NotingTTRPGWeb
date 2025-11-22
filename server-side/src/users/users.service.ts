import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: { username: string; email: string; passwordHash: string }): Promise<User> {
    const user = this.usersRepository.create({
      username: data.username,
      email: data.email,
      passwordHash: data.passwordHash,
    });
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /**
   * Перевіряє, чи існує користувач із заданим email.
   * @param email Email користувача.
   * @returns boolean - true, якщо знайдено, false - якщо ні.
   */
  async checkExistenceByEmail(email: string): Promise<boolean> {
    // Ми можемо просто використати findByEmail
    const user = await this.findByEmail(email);

    // Повертаємо true, якщо об'єкт користувача існує, false - якщо null
    return !!user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.username && dto.username !== user.username) {
      const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
      if (existing) {
        throw new BadRequestException('Username already taken');
      }
      user.username = dto.username;
    }

    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const existing = await this.usersRepository.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (existing) {
        throw new BadRequestException('Email already in use');
      }
      user.email = dto.email.toLowerCase();
    }

    return this.usersRepository.save(user);
  }
}
