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
exports.WorldItemsController = void 0;
const common_1 = require("@nestjs/common");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const world_items_service_1 = require("./world-items.service");
const worlds_service_1 = require("../worlds.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const update_world_item_dto_1 = require("./dto/update-world-item.dto");
const optional_jwt_auth_guard_1 = require("../../common/guards/optional-jwt-auth.guard");
let WorldItemsController = class WorldItemsController {
    constructor(worldItemsService, worldsService) {
        this.worldItemsService = worldItemsService;
        this.worldsService = worldsService;
    }
    async getItem(itemId, user) {
        const item = await this.worldItemsService.getAny(itemId);
        await this.worldsService.ensureCanView(item.worldId, user === null || user === void 0 ? void 0 : user.sub);
        return this.worldItemsService.toResponse(item);
    }
    async updateItem(itemId, dto, user) {
        const item = await this.worldItemsService.getAny(itemId);
        await this.worldsService.ensureCanEdit(item.worldId, user.sub);
        return this.worldItemsService.update(item.worldId, item.id, dto);
    }
    async deleteItem(itemId, user) {
        const item = await this.worldItemsService.getAny(itemId);
        await this.worldsService.ensureCanEdit(item.worldId, user.sub);
        return this.worldItemsService.remove(item.worldId, item.id);
    }
};
exports.WorldItemsController = WorldItemsController;
__decorate([
    (0, common_1.Get)(':itemId'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorldItemsController.prototype, "getItem", null);
__decorate([
    (0, common_1.Patch)(':itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_world_item_dto_1.UpdateWorldItemDto, Object]),
    __metadata("design:returntype", Promise)
], WorldItemsController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorldItemsController.prototype, "deleteItem", null);
exports.WorldItemsController = WorldItemsController = __decorate([
    (0, common_1.Controller)('world-items'),
    __metadata("design:paramtypes", [world_items_service_1.WorldItemsService,
        worlds_service_1.WorldsService])
], WorldItemsController);
