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
exports.WorldsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const world_entity_1 = require("../entities/world.entity");
const world_tag_entity_1 = require("../entities/world-tag.entity");
const user_entity_1 = require("../entities/user.entity");
let WorldsService = class WorldsService {
    constructor(worldsRepository, tagsRepository, usersRepository) {
        this.worldsRepository = worldsRepository;
        this.tagsRepository = tagsRepository;
        this.usersRepository = usersRepository;
    }
    async listPublicWorlds(params) {
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
            qb.andWhere('LOWER(world.name) LIKE :search OR LOWER(world.description) LIKE :search OR LOWER(tag.label) LIKE :search', { search: normalized });
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
    async listOwnedWorlds(userId) {
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
    async getWorld(worldId, requesterId) {
        const world = await this.worldsRepository.findOne({
            where: { id: worldId },
            relations: ['tags', 'coAuthors'],
        });
        if (!world) {
            throw new common_1.NotFoundException('World not found');
        }
        if (!world.isPublic && !this.canAccess(world, requesterId)) {
            throw new common_1.ForbiddenException('World is private');
        }
        return this.toResponse(world);
    }
    async createWorld(ownerId, dto) {
        var _a, _b, _c, _d;
        const world = this.worldsRepository.create({
            ownerId,
            owner: { id: ownerId },
            name: dto.name,
            description: (_a = dto.description) !== null && _a !== void 0 ? _a : '',
            mapUrl: dto.mapUrl,
            type: dto.type,
            era: dto.era,
            themes: dto.themes,
            startingRegion: dto.startingRegion,
            contributors: dto.contributors,
            isPublic: (_b = dto.isPublic) !== null && _b !== void 0 ? _b : false,
        });
        if ((_c = dto.tags) === null || _c === void 0 ? void 0 : _c.length) {
            world.tags = dto.tags.map((label) => this.tagsRepository.create({ label }));
        }
        if ((_d = dto.coAuthorIds) === null || _d === void 0 ? void 0 : _d.length) {
            world.coAuthors = await this.resolveCoAuthors(dto.coAuthorIds, ownerId);
        }
        const saved = await this.worldsRepository.save(world);
        return this.toResponse(saved);
    }
    async updateWorld(worldId, userId, dto) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const world = await this.worldsRepository.findOne({ where: { id: worldId }, relations: ['coAuthors', 'tags'] });
        if (!world) {
            throw new common_1.NotFoundException('World not found');
        }
        if (!this.canEdit(world, userId)) {
            throw new common_1.ForbiddenException('You are not allowed to update this world');
        }
        Object.assign(world, {
            name: (_a = dto.name) !== null && _a !== void 0 ? _a : world.name,
            description: (_b = dto.description) !== null && _b !== void 0 ? _b : world.description,
            mapUrl: (_c = dto.mapUrl) !== null && _c !== void 0 ? _c : world.mapUrl,
            type: (_d = dto.type) !== null && _d !== void 0 ? _d : world.type,
            era: (_e = dto.era) !== null && _e !== void 0 ? _e : world.era,
            themes: (_f = dto.themes) !== null && _f !== void 0 ? _f : world.themes,
            startingRegion: (_g = dto.startingRegion) !== null && _g !== void 0 ? _g : world.startingRegion,
            contributors: (_h = dto.contributors) !== null && _h !== void 0 ? _h : world.contributors,
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
    async deleteWorld(worldId, userId) {
        const world = await this.worldsRepository.findOne({ where: { id: worldId }, relations: ['coAuthors'] });
        if (!world) {
            throw new common_1.NotFoundException('World not found');
        }
        if (!this.canEdit(world, userId)) {
            throw new common_1.ForbiddenException('You are not allowed to delete this world');
        }
        await this.worldsRepository.delete(worldId);
        return { success: true };
    }
    canAccess(world, userId) {
        var _a;
        if (world.isPublic)
            return true;
        if (!userId)
            return false;
        if (world.ownerId === userId)
            return true;
        return (_a = world.coAuthors) === null || _a === void 0 ? void 0 : _a.some((coAuthor) => coAuthor.id === userId);
    }
    canEdit(world, userId) {
        var _a;
        if (!userId)
            return false;
        if (world.ownerId === userId)
            return true;
        return (_a = world.coAuthors) === null || _a === void 0 ? void 0 : _a.some((coAuthor) => coAuthor.id === userId);
    }
    async ensureCanView(worldId, userId) {
        const world = await this.worldsRepository.findOne({ where: { id: worldId }, relations: ['coAuthors'] });
        if (!world) {
            throw new common_1.NotFoundException('World not found');
        }
        if (!this.canAccess(world, userId)) {
            throw new common_1.ForbiddenException('World is private');
        }
        return world;
    }
    async ensureCanEdit(worldId, userId) {
        const world = await this.worldsRepository.findOne({ where: { id: worldId }, relations: ['coAuthors'] });
        if (!world) {
            throw new common_1.NotFoundException('World not found');
        }
        if (!this.canEdit(world, userId)) {
            throw new common_1.ForbiddenException('Forbidden');
        }
        return world;
    }
    async resolveCoAuthors(coAuthorIds, ownerId) {
        const uniqueIds = Array.from(new Set(coAuthorIds)).filter((id) => id && id !== ownerId);
        if (!uniqueIds.length) {
            return [];
        }
        const users = await this.usersRepository.findBy({ id: (0, typeorm_2.In)(uniqueIds) });
        return users;
    }
    toResponse(world) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return {
            id: world.id,
            authorId: world.ownerId,
            name: world.name,
            description: (_a = world.description) !== null && _a !== void 0 ? _a : '',
            contributors: (_b = world.contributors) !== null && _b !== void 0 ? _b : '',
            type: (_c = world.type) !== null && _c !== void 0 ? _c : '',
            era: (_d = world.era) !== null && _d !== void 0 ? _d : '',
            themes: (_e = world.themes) !== null && _e !== void 0 ? _e : '',
            starting_region: (_f = world.startingRegion) !== null && _f !== void 0 ? _f : '',
            visibility: world.isPublic,
            mapUrl: world.mapUrl,
            tags: (_h = (_g = world.tags) === null || _g === void 0 ? void 0 : _g.map((tag) => tag.label)) !== null && _h !== void 0 ? _h : [],
            coAuthorIds: (_k = (_j = world.coAuthors) === null || _j === void 0 ? void 0 : _j.map((user) => user.id)) !== null && _k !== void 0 ? _k : [],
            updatedAt: world.updatedAt,
        };
    }
};
exports.WorldsService = WorldsService;
exports.WorldsService = WorldsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(world_entity_1.World)),
    __param(1, (0, typeorm_1.InjectRepository)(world_tag_entity_1.WorldTag)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], WorldsService);
