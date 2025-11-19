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
exports.WorldItemsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const world_item_entity_1 = require("../../entities/world-item.entity");
let WorldItemsService = class WorldItemsService {
    constructor(worldItemsRepository) {
        this.worldItemsRepository = worldItemsRepository;
    }
    async list(worldId, type) {
        const where = type ? { worldId, type } : { worldId };
        const items = await this.worldItemsRepository.find({ where, order: { updatedAt: 'DESC' } });
        return items.map((item) => this.toResponse(item));
    }
    async get(worldId, itemId) {
        const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return this.toResponse(item);
    }
    async getAny(itemId) {
        const item = await this.worldItemsRepository.findOne({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
    async create(worldId, dto) {
        var _a;
        const item = this.worldItemsRepository.create({
            worldId,
            name: dto.name,
            type: dto.type,
            payload: (_a = dto.payload) !== null && _a !== void 0 ? _a : {},
        });
        const saved = await this.worldItemsRepository.save(item);
        return this.toResponse(saved);
    }
    async update(worldId, itemId, dto) {
        const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (dto.name)
            item.name = dto.name;
        if (dto.type)
            item.type = dto.type;
        if (dto.payload)
            item.payload = { ...item.payload, ...dto.payload };
        const saved = await this.worldItemsRepository.save(item);
        return this.toResponse(saved);
    }
    async remove(worldId, itemId) {
        const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        await this.worldItemsRepository.remove(item);
        return { success: true };
    }
    toResponse(item) {
        return {
            id: item.id,
            worldId: item.worldId,
            type: item.type,
            name: item.name,
            ...item.payload,
        };
    }
};
exports.WorldItemsService = WorldItemsService;
exports.WorldItemsService = WorldItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(world_item_entity_1.WorldItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorldItemsService);
