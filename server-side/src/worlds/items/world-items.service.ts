import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorldItem } from '../../entities/world-item.entity';
import { CreateWorldItemDto } from './dto/create-world-item.dto';
import { UpdateWorldItemDto } from './dto/update-world-item.dto';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorldItemsService {
  constructor(
    @InjectRepository(WorldItem)
    private readonly worldItemsRepository: Repository<WorldItem>,
  ) {}

  async list(worldId: string, type?: string) {
    const where = type ? { worldId, type } : { worldId };
    const items = await this.worldItemsRepository.find({ where, order: { updatedAt: 'DESC' } });
    return items.map((item) => this.toResponse(item));
  }

  async get(worldId: string, itemId: string) {
    const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return this.toResponse(item);
  }

  async getAny(itemId: string) {
    const item = await this.worldItemsRepository.findOne({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }

  async create(
    worldId: string,
    dto: CreateWorldItemDto,
    imageFile?: Express.Multer.File,
    galleryFiles?: Express.Multer.File[], // 🆕
  ) {
    let imageUrl = null;
    let galleryImages: string[] = [];

    // 1. Зберігаємо головне фото
    if (imageFile) {
      imageUrl = await this.saveFile(imageFile);
    }

    // 2. Зберігаємо галерею (паралельно)
    if (galleryFiles && galleryFiles.length > 0) {
      galleryImages = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
    }

    const item = this.worldItemsRepository.create({
      worldId,
      ...dto,
      imageUrl,
      galleryImages, // 🆕 Записуємо в базу
    });

    return this.worldItemsRepository.save(item);
  }

  async update(worldId: string, itemId: string, dto: UpdateWorldItemDto) {
    const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (dto.name) item.name = dto.name;
    if (dto.type) item.type = dto.type;
    if (dto.payload) item.payload = { ...item.payload, ...dto.payload };

    const saved = await this.worldItemsRepository.save(item);
    return this.toResponse(saved);
  }

  async remove(worldId: string, itemId: string) {
    const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    await this.worldItemsRepository.remove(item);
    return { success: true };
  }

  toResponse(item: WorldItem) {
    return {
      id: item.id,
      worldId: item.worldId,
      type: item.type,
      name: item.name,
      imageUrl: item.imageUrl,
      galleryImages: item.galleryImages || [], // 🆕
      payload: item.payload,
      createdAt: item.createdAt, // опціонально
      updatedAt: item.updatedAt, // опціонально
    };
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    // Шлях до папки uploads у корені проекту
    const uploadDir = path.join(process.cwd(), 'uploads');

    // Створюємо папку, якщо її немає
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Генеруємо унікальне ім'я
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Записуємо файл
    fs.writeFileSync(filePath, file.buffer);

    return fileName;
  }
}
