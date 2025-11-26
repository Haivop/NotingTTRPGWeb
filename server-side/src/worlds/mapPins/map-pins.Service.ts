import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MapPin } from '../../entities/map-pin.entity';
import { CreateMapPinDto } from '../mapPins/dto/create-map-dto';

@Injectable()
export class MapPinsService {
  constructor(
    @InjectRepository(MapPin)
    private readonly mapPinRepository: Repository<MapPin>,
  ) {}

  async findAllByWorld(worldId: string) {
    return this.mapPinRepository.find({
      where: { worldId },
      relations: ['linkedItem'],
    });
  }

  async create(worldId: string, dto: CreateMapPinDto) {
    const pin = this.mapPinRepository.create({
      worldId,
      x: dto.x,
      y: dto.y,
      itemId: dto.itemId,
      color: dto.color,
      customLabel: dto.customLabel,
    });
    return this.mapPinRepository.save(pin);
  }

  async findOne(id: string): Promise<MapPin> {
    const pin = await this.mapPinRepository.findOne({ where: { id } });
    if (!pin) {
      throw new NotFoundException(`Map pin with ID ${id} not found`);
    }
    return pin;
  }

  async remove(id: string) {
    const result = await this.mapPinRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Map pin with ID ${id} not found`);
    }
    return { success: true };
  }
}
