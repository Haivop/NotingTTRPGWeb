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
exports.WorldsController = void 0;
const common_1 = require("@nestjs/common");
const worlds_service_1 = require("./worlds.service");
const create_world_dto_1 = require("./dto/create-world.dto");
const update_world_dto_1 = require("./dto/update-world.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../common/guards/optional-jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const world_items_service_1 = require("./items/world-items.service");
const create_world_item_dto_1 = require("./items/dto/create-world-item.dto");
const update_world_item_dto_1 = require("./items/dto/update-world-item.dto");
const platform_express_1 = require("@nestjs/platform-express");
const platform_express_2 = require("@nestjs/platform-express");
const common_2 = require("@nestjs/common");
let WorldsController = class WorldsController {
    constructor(worldsService, worldItemsService) {
        this.worldsService = worldsService;
        this.worldItemsService = worldItemsService;
    }
    getPublicWorlds(page = 1, limit = 12, search) {
        const sanitizedPage = Math.max(Number(page) || 1, 1);
        const sanitizedLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
        return this.worldsService.listPublicWorlds({
            page: sanitizedPage,
            limit: sanitizedLimit,
            search,
        });
    }
    getMyWorlds(user) {
        return this.worldsService.listOwnedWorlds(user.sub);
    }
    getWorld(worldId, user) {
        return this.worldsService.getWorld(worldId, user === null || user === void 0 ? void 0 : user.sub);
    }
    createWorld(dto, user, image) {
        return this.worldsService.createWorld(user.sub, dto, image);
    }
    updateWorld(worldId, dto, user, image) {
        return this.worldsService.updateWorld(worldId, user.sub, dto, image);
    }
    deleteWorld(worldId, user) {
        return this.worldsService.deleteWorld(worldId, user.sub);
    }
    async listItems(worldId, type, user) {
        await this.worldsService.ensureCanView(worldId, user === null || user === void 0 ? void 0 : user.sub);
        return this.worldItemsService.list(worldId, type);
    }
    async getItem(worldId, itemId, user) {
        await this.worldsService.ensureCanView(worldId, user === null || user === void 0 ? void 0 : user.sub);
        return this.worldItemsService.get(worldId, itemId);
    }
    async createItem(worldId, dto, user, files) {
        var _a;
        await this.worldsService.ensureCanEdit(worldId, user.sub);
        const mainImage = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0];
        const galleryImages = files === null || files === void 0 ? void 0 : files.gallery;
        return this.worldItemsService.create(worldId, dto, mainImage, galleryImages);
    }
    async updateItem(worldId, itemId, dto, user) {
        await this.worldsService.ensureCanEdit(worldId, user.sub);
        return this.worldItemsService.update(worldId, itemId, dto);
    }
    async deleteItem(worldId, itemId, user) {
        await this.worldsService.ensureCanEdit(worldId, user.sub);
        return this.worldItemsService.remove(worldId, itemId);
    }
};
exports.WorldsController = WorldsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "getPublicWorlds", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "getMyWorlds", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "getWorld", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_world_dto_1.CreateWorldDto, Object, Object]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "createWorld", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_world_dto_1.UpdateWorldDto, Object, Object]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "updateWorld", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], WorldsController.prototype, "deleteWorld", null);
__decorate([
    (0, common_1.Get)(':id/items'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WorldsController.prototype, "listItems", null);
__decorate([
    (0, common_1.Get)(':id/items/:itemId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WorldsController.prototype, "getItem", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_2.FileFieldsInterceptor)([
        { name: 'image', maxCount: 1 },
        { name: 'gallery', maxCount: 10 },
    ])),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_2.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_world_item_dto_1.CreateWorldItemDto, Object, Object]),
    __metadata("design:returntype", Promise)
], WorldsController.prototype, "createItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_world_item_dto_1.UpdateWorldItemDto, Object]),
    __metadata("design:returntype", Promise)
], WorldsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], WorldsController.prototype, "deleteItem", null);
exports.WorldsController = WorldsController = __decorate([
    (0, common_1.Controller)('worlds'),
    __metadata("design:paramtypes", [worlds_service_1.WorldsService,
        world_items_service_1.WorldItemsService])
], WorldsController);
