"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const world_entity_1 = require("../entities/world.entity");
const world_item_entity_1 = require("../entities/world-item.entity");
const site_content_entity_1 = require("../entities/site-content.entity");
const DEFAULT_CONTENT = [
    {
        key: 'home.hero',
        payload: {
            eyebrow: 'Fantasy Worldbuilding Suite',
            title: 'Forge Your Worlds',
            description: 'Give your imagination a gallery worthy of its legends. Sketch maps, bind lore, choreograph quests, and invite co-authors—all within a luminous atelier made for storytellers.',
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
let DiscoveryService = class DiscoveryService {
    constructor(worldsRepository, worldItemsRepository, siteContentRepository) {
        this.worldsRepository = worldsRepository;
        this.worldItemsRepository = worldItemsRepository;
        this.siteContentRepository = siteContentRepository;
    }
    async onModuleInit() {
        await this.seedContent();
    }
    async seedContent() {
        for (const seed of DEFAULT_CONTENT) {
            await this.siteContentRepository.save({ key: seed.key, payload: seed.payload });
        }
    }
    async getContent(key, fallback) {
        var _a;
        const record = await this.siteContentRepository.findOne({ where: { key } });
        if (!record) {
            return fallback;
        }
        return (_a = record.payload) !== null && _a !== void 0 ? _a : fallback;
    }
    worldToCard(world) {
        var _a, _b, _c;
        return {
            id: world.id,
            name: world.name,
            description: (_a = world.description) !== null && _a !== void 0 ? _a : '',
            summary: (_c = (_b = world.description) === null || _b === void 0 ? void 0 : _b.slice(0, 140)) !== null && _c !== void 0 ? _c : '',
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
        const stats = {};
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
            liveUpdates: liveUpdates.map((world) => {
                var _a, _b;
                return ({
                    id: world.id,
                    name: world.name,
                    summary: (_b = (_a = world.description) === null || _a === void 0 ? void 0 : _a.slice(0, 120)) !== null && _b !== void 0 ? _b : 'New lore added.',
                    updatedAt: world.updatedAt,
                });
            }),
            events,
        };
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(world_entity_1.World)),
    __param(1, (0, typeorm_1.InjectRepository)(world_item_entity_1.WorldItem)),
    __param(2, (0, typeorm_1.InjectRepository)(site_content_entity_1.SiteContent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DiscoveryService);
