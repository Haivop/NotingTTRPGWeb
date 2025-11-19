import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorldItem } from '../../entities/world-item.entity';
import { CreateWorldItemDto } from './dto/create-world-item.dto';
import { UpdateWorldItemDto } from './dto/update-world-item.dto';

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

  async create(worldId: string, dto: CreateWorldItemDto) {
    const item = this.worldItemsRepository.create({
      worldId,
      name: dto.name,
      type: dto.type,
      payload: dto.payload ?? {},
    });
    const saved = await this.worldItemsRepository.save(item);
    return this.toResponse(saved);
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
      ...item.payload,
    };
  }
}
