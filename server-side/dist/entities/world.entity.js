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
exports.World = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const world_item_entity_1 = require("./world-item.entity");
const world_tag_entity_1 = require("./world-tag.entity");
let World = class World {
};
exports.World = World;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], World.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], World.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], World.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'map_url', nullable: true }),
    __metadata("design:type", String)
], World.prototype, "mapUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], World.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], World.prototype, "era", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], World.prototype, "themes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'starting_region', nullable: true }),
    __metadata("design:type", String)
], World.prototype, "startingRegion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], World.prototype, "contributors", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_public', default: true }),
    __metadata("design:type", Boolean)
], World.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.ownedWorlds, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], World.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'owner_id' }),
    __metadata("design:type", String)
], World.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.coauthoredWorlds, {
        cascade: false,
    }),
    (0, typeorm_1.JoinTable)({
        name: 'world_co_authors',
        joinColumn: { name: 'world_id' },
        inverseJoinColumn: { name: 'user_id' },
    }),
    __metadata("design:type", Array)
], World.prototype, "coAuthors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => world_item_entity_1.WorldItem, (item) => item.world),
    __metadata("design:type", Array)
], World.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => world_tag_entity_1.WorldTag, (tag) => tag.world, { cascade: true }),
    __metadata("design:type", Array)
], World.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], World.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], World.prototype, "updatedAt", void 0);
exports.World = World = __decorate([
    (0, typeorm_1.Entity)({ name: 'worlds' })
], World);
