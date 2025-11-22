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

    console.log('=========================================');
    console.log('🔄 SERVICE UPDATE: START');
    console.log(`[Item: ${itemId}] Old Gallery:`, item.galleryImages);
    console.log('[DTO] Existing to keep:', dto.existingGalleryImages);
    console.log(`[FILE] New Cover: ${imageFile?.originalname || 'None'}`);
    console.log(`[FILE] New Gallery Count: ${galleryFiles?.length || 0}`);
    console.log(galleryFiles);
    console.log('=========================================');

    // Змінні для керування
    let uploadedNewFiles: string[] = [];
    const oldGalleryImages = item.galleryImages || []; // Файли галереї, що зараз у БД
    let filesToKeep: string[] = [];

    // 1. Оновлення головного фото (imageUrl)
    if (imageFile) {
      // ⚠️ КРОК 1: Видаляємо старий файл, якщо він існує
      if (item.imageUrl) {
        await this.deleteFile(item.imageUrl);
      }
      item.imageUrl = await this.saveFile(imageFile);
    }

    // 2. Обробка нових файлів галереї
    if (galleryFiles && galleryFiles.length > 0) {
      uploadedNewFiles = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
      console.log('[GALLERY] Uploaded new files:', uploadedNewFiles);
    }

    // 3. Фільтрація СТАРИХ/НОВИХ ФАЙЛІВ та ВИДАЛЕННЯ
    const requiredToKeep = new Set(dto.existingGalleryImages || []);

    // 3.1. Визначаємо список усіх потенційних файлів (старі + нові)
    const allPossibleFileNames = [...oldGalleryImages, ...uploadedNewFiles];

    // 🟢 ВИПРАВЛЕННЯ: Ми зберігаємо всі старі файли, які попросив зберегти фронтенд,
    // 🟢 а також ВСІ НОВІ, які щойно були завантажені (uploadedNewFiles).

    // Визначаємо старі файли, які зберігаються
    const keptOldFiles = oldGalleryImages.filter((fileName) => requiredToKeep.has(fileName));

    // 3.2. Формуємо фінальний список: (старі_збережені) + (усі_нові_завантажені)
    filesToKeep = [...keptOldFiles, ...uploadedNewFiles];

    // 3.3. Визначаємо, які файли галереї потрібно видалити з ДИСКА
    // Логіка видалення залишається правильною: видаляємо ті, що були в БД, але не в requiredToKeep.
    const filesToDelete = oldGalleryImages.filter((fileName) => !requiredToKeep.has(fileName));

    // 3.4. ВИКОНУЄМО ВИДАЛЕННЯ З ДИСКА
    if (filesToDelete.length > 0) {
      await Promise.all(filesToDelete.map((fileName) => this.deleteFile(fileName)));
    }
    // 4. Оновлення текстових полів
    if (dto.name) item.name = dto.name;
    if (dto.type) item.type = dto.type;
    if (dto.payload) item.payload = { ...item.payload, ...dto.payload };

    // 5. Збереження оновленого списку галереї в БД
    item.galleryImages = filesToKeep;

    console.log(filesToKeep);

    const saved = await this.worldItemsRepository.save(item);
    return this.toResponse(saved);
  }

  // ------------------------------------------------------------------
  // 🟢 НОВИЙ ПРИВАТНИЙ МЕТОД: ВИДАЛЕННЯ ФАЙЛУ З ДИСКА
  // ------------------------------------------------------------------
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
