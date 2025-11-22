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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldItem = void 0;
const typeorm_1 = require("typeorm");
const world_entity_1 = require("./world.entity");
let WorldItem = class WorldItem {
};
exports.WorldItem = WorldItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WorldItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => world_entity_1.World, (world) => world.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'world_id' }),
    __metadata("design:type", world_entity_1.World)
], WorldItem.prototype, "world", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'world_id' }),
    __metadata("design:type", String)
], WorldItem.prototype, "worldId", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 80 }),
    __metadata("design:type", String)
], WorldItem.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], WorldItem.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_url', nullable: true }),
    __metadata("design:type", String)
], WorldItem.prototype, "imageUrl", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { name: 'gallery_images', nullable: true }),
    __metadata("design:type", Array)
], WorldItem.prototype, "galleryImages", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: () => "'{}'" }),
    __metadata("design:type", Object)
], WorldItem.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WorldItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WorldItem.prototype, "updatedAt", void 0);
exports.WorldItem = WorldItem = __decorate([
    (0, typeorm_1.Entity)({ name: 'world_items' })
], WorldItem);
