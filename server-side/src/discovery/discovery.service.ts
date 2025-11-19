import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { World } from '../entities/world.entity';
import { WorldItem } from '../entities/world-item.entity';
import { SiteContent } from '../entities/site-content.entity';

type ContentPayload = Record<string, any> | any[];
type ContentSeed = { key: string; payload: ContentPayload };

const DEFAULT_CONTENT: ContentSeed[] = [
  {
    key: 'home.hero',
    payload: {
      eyebrow: 'Fantasy Worldbuilding Suite',
      title: 'Forge Your Worlds',
      description:
        'Give your imagination a gallery worthy of its legends. Sketch maps, bind lore, choreograph quests, and invite co-authors—all within a luminous atelier made for storytellers.',
      primaryCta: { label: 'Begin a New World', href: '/worlds/create' },
      secondaryCta: { label: 'Explore the Hub', href: '/hub' },
    },
  },
  {
    key: 'home.features',
    payload: [
      {
        title: 'Lore Atlas',
        description: 'Map continents, regions, and locations with layered notes, pins, and history trails.',
      },
      {
        title: 'Character Chronicles',
        description: 'Track factions, relationships, and arcs across your saga with timeline waypoints.',
      },
      {
        title: 'Quest Loom',
        description: 'Spin objectives, rewards, and branching decisions that evolve as your world does.',
      },
    ],
  },
  {
    key: 'hub.events',
    payload: [
      {
        title: "Moonlit Cartography Jam",
        description: 'Sketch astral maps with other storytellers under a shared star chart.',
      },
      {
        title: 'Chronicle Exchange',
        description: 'Trade lore hooks and NPC dossiers to fuel each other’s campaigns.',
      },
      {
        title: 'Faction Summit',
        description: 'Host a conclave for rival leaders to negotiate uneasy alliances.',
      },
      {
        title: "Artifact Forgers' Market",
        description: 'Collaborate on legendary items with layered histories and mechanical twists.',
      },
    ],
  },
];

@Injectable()
export class DiscoveryService implements OnModuleInit {
  constructor(
    @InjectRepository(World)
    private readonly worldsRepository: Repository<World>,
    @InjectRepository(WorldItem)
    private readonly worldItemsRepository: Repository<WorldItem>,
    @InjectRepository(SiteContent)
    private readonly siteContentRepository: Repository<SiteContent>,
  ) {}

  async onModuleInit() {
    await this.seedContent();
  }

  private async seedContent() {
    for (const seed of DEFAULT_CONTENT) {
      await this.siteContentRepository.save({ key: seed.key, payload: seed.payload });
    }
  }

  private async getContent<T>(key: string, fallback: T): Promise<T> {
    const record = await this.siteContentRepository.findOne({ where: { key } });
    if (!record) {
      return fallback;
    }
    return (record.payload as T) ?? fallback;
  }

  private worldToCard(world: World) {
    return {
      id: world.id,
      name: world.name,
      description: world.description ?? '',
      summary: world.description?.slice(0, 140) ?? '',
      updatedAt: world.updatedAt,
    };
  }

  async getHomeHighlights() {
    const hero = await this.getContent('home.hero', DEFAULT_CONTENT[0].payload);
    const features = await this.getContent('home.features', DEFAULT_CONTENT[1].payload);
    const spotlightWorlds = await this.worldsRepository.find({
      where: { isPublic: true },
      order: { updatedAt: 'DESC' },
      take: 3,
    });

    return {
      hero,
      features,
      spotlightWorlds: spotlightWorlds.map((world) => this.worldToCard(world)),
    };
  }

  async getHubSummary() {
    const statsRaw = await this.worldItemsRepository
      .createQueryBuilder('item')
      .select('item.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('item.type')
      .getRawMany();

    const stats: Record<string, number> = {};
    for (const row of statsRaw) {
      stats[row.type] = Number(row.count);
    }

    const totalWorlds = await this.worldsRepository.count({ where: { isPublic: true } });

    const featuredWorlds = await this.worldsRepository.find({
      where: { isPublic: true },
      order: { updatedAt: 'DESC' },
      take: 3,
    });

    const liveUpdates = await this.worldsRepository.find({
      where: { isPublic: true },
      order: { updatedAt: 'DESC' },
      take: 4,
    });

    const events = await this.getContent('hub.events', DEFAULT_CONTENT[2].payload);

    return {
      stats: {
        worlds: totalWorlds,
        ...stats,
      },
      featuredWorlds: featuredWorlds.map((world) => this.worldToCard(world)),
      liveUpdates: liveUpdates.map((world) => ({
        id: world.id,
        name: world.name,
        summary: world.description?.slice(0, 120) ?? 'New lore added.',
        updatedAt: world.updatedAt,
      })),
      events,
    };
  }
}
