import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors, // 👈 Виправляє 'UseInterceptors'
  UploadedFile, // 👈 Якщо ви використовуєте його (хоча тут не використовується напряму)
  UploadedFiles, // 👈 Виправляє 'UploadedFiles'
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { WorldItemsService } from './world-items.service';
import { WorldsService } from '../worlds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateWorldItemDto } from './dto/update-world-item.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('world-items')
export class WorldItemsController {
  constructor(
    private readonly worldItemsService: WorldItemsService,
    private readonly worldsService: WorldsService,
  ) {}

  @Get(':itemId')
  @UseGuards(OptionalJwtAuthGuard)
  async getItem(@Param('itemId') itemId: string, @CurrentUser() user?: JwtPayload) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanView(item.worldId, user?.sub);
    return this.worldItemsService.toResponse(item);
  }

  @Patch(':itemId')
  @UseGuards(JwtAuthGuard)
  // 🟢 ВИКОРИСТОВУЄМО ОДИН ІНТЕРЦЕПТОР ДЛЯ ВСІХ ФАЙЛІВ
  @UseInterceptors(AnyFilesInterceptor())
  async updateItem(
    @Param('itemId') itemId: string,
    @UploadedFiles() files: Array<Express.Multer.File>, // 🟢 Отримуємо всі файли разом
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: false,
        whitelist: true,
      }),
    )
    dto: UpdateWorldItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    // 1. Діагностика (переконайтеся, що 'dto' тепер не порожній)
    console.log('=========================================');
    console.log('[BODY] Received DTO:', dto);
    console.log(
      '[FILES] Received Files:',
      files.map((f) => f.fieldname + ':' + f.originalname),
    );
    console.log('=========================================');

    // 2. Розділення файлів
    const imageFile = files.find((f) => f.fieldname === 'image');
    const galleryFiles = files.filter((f) => f.fieldname === 'galleryImages');
    console.log(galleryFiles);

    // 3. Отримання сутності та перевірка прав
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);

    // 4. Виклик сервісу
    return this.worldItemsService.update(item.worldId, item.id, dto, imageFile, galleryFiles);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async deleteItem(@Param('itemId') itemId: string, @CurrentUser() user: JwtPayload) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);
    return this.worldItemsService.remove(item.worldId, item.id);
  }
}
