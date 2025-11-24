import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { World } from '../entities/world.entity';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { WorldTag } from '../entities/world-tag.entity';
import { User } from '../entities/user.entity';

import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WorldsService {
  constructor(
    @InjectRepository(World)
    private readonly worldsRepository: Repository<World>,
    @InjectRepository(WorldTag)
    private readonly tagsRepository: Repository<WorldTag>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async listPublicWorlds(params: { page: number; limit: number; search?: string }) {
    const { page, limit, search } = params;
    const qb = this.worldsRepository
      .createQueryBuilder('world')
      .leftJoinAndSelect('world.tags', 'tag')
      .leftJoinAndSelect('world.coAuthors', 'coAuthor')
      .where('world.is_public = :isPublic', { isPublic: true })
      .distinct(true)
      .orderBy('world.updated_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      const normalized = `%${search.toLowerCase()}%`;
      qb.andWhere(
        'LOWER(world.name) LIKE :search OR LOWER(world.description) LIKE :search OR LOWER(tag.label) LIKE :search',
        { search: normalized },
      );
    }

    const [worlds, total] = await qb.getManyAndCount();
    return {
      data: worlds.map((world) => this.toResponse(world)),
      meta: {
        total,
        page,
        pages: Math.max(Math.ceil(total / limit), 1),
      },
    };
  }

  async listOwnedWorlds(userId: string) {
    const qb = this.worldsRepository
      .createQueryBuilder('world')
      .leftJoinAndSelect('world.tags', 'tag')
      .leftJoinAndSelect('world.coAuthors', 'coAuthor')
      .where('world.owner_id = :userId', { userId })
      .orWhere('coAuthor.id = :userId', { userId })
      .distinct(true)
      .orderBy('world.updated_at', 'DESC');

    const worlds = await qb.getMany();
    return worlds.map((world) => this.toResponse(world));
  }

  async getWorld(worldId: string, requesterId?: string) {
    const world = await this.worldsRepository.findOne({
      where: { id: worldId },
      relations: ['tags', 'coAuthors'],
    });

    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (!world.isPublic && !this.canAccess(world, requesterId)) {
      throw new ForbiddenException('World is private');
    }

    return this.toResponse(world);
  }

  async createWorld(ownerId: string, dto: CreateWorldDto, imageFile?: Express.Multer.File) {
    let mapUrl: string | null = dto.mapUrl || null;

    if (imageFile) {
      mapUrl = await this.saveFile(imageFile);
    }

    const world = this.worldsRepository.create({
      ownerId,
      owner: { id: ownerId } as User,
      name: dto.name,
      description: dto.description ?? '',
      mapUrl: mapUrl,
      type: dto.type,
      era: dto.era,
      themes: dto.themes,
      startingRegion: dto.startingRegion,
      contributors: dto.contributors,
      isPublic: dto.isPublic ?? false,
    });

    if (dto.tags?.length) {
      world.tags = dto.tags.map((label) => this.tagsRepository.create({ label }));
    }

    if (dto.coAuthorIds?.length) {
      world.coAuthors = await this.resolveCoAuthors(dto.coAuthorIds, ownerId);
    }

    const saved = await this.worldsRepository.save(world);
    return this.toResponse(saved);
  }

  async updateWorld(
    worldId: string,
    userId: string,
    dto: UpdateWorldDto,
    imageFile?: Express.Multer.File,
  ) {
    const world = await this.worldsRepository.findOne({
      where: { id: worldId },
      relations: ['coAuthors', 'tags'],
    });
    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (!this.canEdit(world, userId)) {
      throw new ForbiddenException('You are not allowed to update this world');
    }

    if (imageFile) {
      const fileName = await this.saveFile(imageFile);
      world.mapUrl = fileName;
    } else if (dto.mapUrl !== undefined) {
      world.mapUrl = dto.mapUrl;
    }

    Object.assign(world, {
      name: dto.name ?? world.name,
      description: dto.description ?? world.description,
      type: dto.type ?? world.type,
      era: dto.era ?? world.era,
      themes: dto.themes ?? world.themes,
      startingRegion: dto.startingRegion ?? world.startingRegion,
      contributors: dto.contributors ?? world.contributors,
    });

    if (typeof dto.isPublic === 'boolean') {
      world.isPublic = dto.isPublic;
    }

    if (dto.tags) {
      await this.tagsRepository.delete({ worldId });
      world.tags = dto.tags.map((label) => this.tagsRepository.create({ label, worldId }));
    }

    if (dto.coAuthorIds) {
      world.coAuthors = await this.resolveCoAuthors(dto.coAuthorIds, world.ownerId);
    }

    const saved = await this.worldsRepository.save(world);
    return this.toResponse(saved);
  }

  async deleteWorld(worldId: string, userId: string) {
    const world = await this.worldsRepository.findOne({
      where: { id: worldId },
      relations: ['coAuthors'],
    });
    if (!world) {
      throw new NotFoundException('World not found');
    }

    if (!this.canEdit(world, userId)) {
      throw new ForbiddenException('You are not allowed to delete this world');
    }

    await this.worldsRepository.delete(worldId);
    return { success: true };
  }

  canAccess(world: World, userId?: string) {
    if (world.isPublic) return true;
    if (!userId) return false;
    if (world.ownerId === userId) return true;
    return world.coAuthors?.some((coAuthor) => coAuthor.id === userId);
  }

  canEdit(world: World, userId: string) {
    if (!userId) return false;
    if (world.ownerId === userId) return true;
    return world.coAuthors?.some((coAuthor) => coAuthor.id === userId);
  }

  async ensureCanView(worldId: string, userId?: string) {
    const world = await this.worldsRepository.findOne({
      where: { id: worldId },
      relations: ['coAuthors'],
    });
    if (!world) {
      throw new NotFoundException('World not found');
    }
    if (!this.canAccess(world, userId)) {
      throw new ForbiddenException('World is private');
    }
    return world;
  }

  async ensureCanEdit(worldId: string, userId: string) {
    const world = await this.worldsRepository.findOne({
      where: { id: worldId },
      relations: ['coAuthors'],
    });
    if (!world) {
      throw new NotFoundException('World not found');
    }
    if (!this.canEdit(world, userId)) {
      throw new ForbiddenException('Forbidden');
    }
    return world;
  }

  private async resolveCoAuthors(coAuthorIds: string[], ownerId: string) {
    const uniqueIds = Array.from(new Set(coAuthorIds)).filter((id) => id && id !== ownerId);
    if (!uniqueIds.length) {
      return [];
    }
    const users = await this.usersRepository.findBy({ id: In(uniqueIds) });
    return users;
  }

  private toResponse(world: World) {
    return {
      id: world.id,
      authorId: world.ownerId,
      name: world.name,
      description: world.description ?? '',
      contributors: world.contributors ?? '',
      type: world.type ?? '',
      era: world.era ?? '',
      themes: world.themes ?? '',
      starting_region: world.startingRegion ?? '',
      visibility: world.isPublic,
      mapUrl: world.mapUrl,
      tags: world.tags?.map((tag) => tag.label) ?? [],
      coAuthorIds: world.coAuthors?.map((user) => user.id) ?? [],
      updatedAt: world.updatedAt,
    };
  }

  private async saveFile(file: Express.Multer.File): Promise<string> {
    const uploadDir = path.resolve(__dirname, '..', '..', 'uploads');

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
