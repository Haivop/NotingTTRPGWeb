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

    if (imageFile) {
      imageUrl = await this.saveFile(imageFile);
    }

    if (galleryFiles && galleryFiles.length > 0) {
      galleryImages = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
    }

    const item = this.worldItemsRepository.create({
      worldId,
      ...dto,
      imageUrl,
      galleryImages,
    });

    return this.worldItemsRepository.save(item);
  }

  async update(
    worldId: string,
    itemId: string,
    dto: UpdateWorldItemDto,
    imageFile?: Express.Multer.File,
    galleryFiles?: Express.Multer.File[],
  ) {
    const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    let uploadedNewFiles: string[] = [];
    const oldGalleryImages = item.galleryImages || [];
    let filesToKeep: string[] = [];

    if (imageFile) {
      if (item.imageUrl) {
        await this.deleteFile(item.imageUrl);
      }
      item.imageUrl = await this.saveFile(imageFile);
    }

    if (galleryFiles && galleryFiles.length > 0) {
      uploadedNewFiles = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
      console.log('[GALLERY] Uploaded new files:', uploadedNewFiles);
    }

    const requiredToKeep = new Set(dto.existingGalleryImages || []);

    const allPossibleFileNames = [...oldGalleryImages, ...uploadedNewFiles];

    const keptOldFiles = oldGalleryImages.filter((fileName) => requiredToKeep.has(fileName));

    filesToKeep = [...keptOldFiles, ...uploadedNewFiles];

    const filesToDelete = oldGalleryImages.filter((fileName) => !requiredToKeep.has(fileName));

    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((fileName) => this.deleteFile(fileName)));
    }
    if (dto.name) item.name = dto.name;
    if (dto.type) item.type = dto.type;
    if (dto.payload) item.payload = { ...item.payload, ...dto.payload };

    item.galleryImages = filesToKeep;

    console.log(filesToKeep);

    const saved = await this.worldItemsRepository.save(item);
    return this.toResponse(saved);
  }

  private async deleteFile(fileName: string): Promise<void> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const filePath = path.join(uploadDir, fileName);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`[DELETE] Successfully deleted file: ${fileName}`);
      } catch (error) {
        console.error(`[DELETE] Failed to delete file ${fileName}:`, error);
      }
    } else {
      console.warn(`[DELETE] File not found on disk: ${fileName}`);
    }
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
      galleryImages: item.galleryImages || [],
      payload: item.payload,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);
    return fileName;
  }
}
