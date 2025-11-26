import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from '../entities/world.entity';
import { WorldItem } from '../entities/world-item.entity';

export interface SearchParams {
  query?: string;
  type?: string;
  worldLimit?: number;
  itemLimit?: number;
}

export interface SearchResult {
  query: string;
  worlds: Array<{
    id: string;
    name: string;
    description: string;
    tags: string[];
    updatedAt?: Date;
  }>;
  items: Array<{
    id: string;
    worldId: string;
    worldName?: string;
    type: string;
    name: string;
    snippet?: string;
    imageUrl?: string;
    updatedAt?: Date;
  }>;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(World)
    private readonly worldsRepository: Repository<World>,
    @InjectRepository(WorldItem)
    private readonly worldItemsRepository: Repository<WorldItem>,
  ) {}

  async search(params: SearchParams): Promise<SearchResult> {
    const { query, type } = params;
    const worldLimit = Math.min(Math.max(params.worldLimit ?? 6, 1), 30);
    const itemLimit = Math.min(Math.max(params.itemLimit ?? 12, 1), 50);

    const normalizedQuery = query?.trim().toLowerCase() ?? '';
    const searchTerm = normalizedQuery ? `%${normalizedQuery}%` : null;
    const typeFilter = type?.trim().toLowerCase();

    const worldsQb = this.worldsRepository
      .createQueryBuilder('world')
      .leftJoinAndSelect('world.tags', 'tag')
      .where('world.is_public = :isPublic', { isPublic: true })
      .orderBy('world.updatedAt', 'DESC')
      .take(worldLimit);

    if (searchTerm) {
      worldsQb.andWhere(
        '(LOWER(world.name) LIKE :search OR LOWER(world.description) LIKE :search OR LOWER(tag.label) LIKE :search)',
        { search: searchTerm },
      );
    }

    const worlds = await worldsQb.getMany();

    const itemsQb = this.worldItemsRepository
      .createQueryBuilder('item')
      .innerJoinAndSelect('item.world', 'world')
      .where('world.is_public = :isPublic', { isPublic: true })
      .orderBy('item.updatedAt', 'DESC')
      .take(itemLimit);

    if (typeFilter) {
      itemsQb.andWhere('LOWER(item.type) = :type', { type: typeFilter });
    }

    if (searchTerm) {
      itemsQb.andWhere(
        '(LOWER(item.name) LIKE :search OR LOWER(CAST(item.payload AS TEXT)) LIKE :search)',
        { search: searchTerm },
      );
    }

    const items = await itemsQb.getMany();

    return {
      query: normalizedQuery,
      worlds: worlds.map((world) => ({
        id: world.id,
        name: world.name,
        description: world.description ?? '',
        tags: world.tags?.map((tag) => tag.label) ?? [],
        updatedAt: world.updatedAt,
      })),
      items: items.map((item) => ({
        id: item.id,
        worldId: item.worldId,
        worldName: item.world?.name,
        type: item.type,
        name: item.name,
        snippet: this.extractSnippet(item),
        imageUrl: item.imageUrl,
        updatedAt: item.updatedAt,
      })),
    };
  }

  private extractSnippet(item: WorldItem): string | undefined {
    if (!item.payload) {
      return undefined;
    }

    const values = Object.values(item.payload).filter((value) => typeof value === 'string');
    const snippet = values.find((value) => value.trim().length > 0);
    return snippet?.slice(0, 160);
  }
}
