"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorldsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const world_entity_1 = require("../entities/world.entity");
const world_tag_entity_1 = require("../entities/world-tag.entity");
const world_item_entity_1 = require("../entities/world-item.entity");
const worlds_service_1 = require("./worlds.service");
const worlds_controller_1 = require("./worlds.controller");
const world_items_service_1 = require("./items/world-items.service");
const world_items_controller_1 = require("./items/world-items.controller");
const user_entity_1 = require("../entities/user.entity");
let WorldsModule = class WorldsModule {
};
exports.WorldsModule = WorldsModule;
exports.WorldsModule = WorldsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([world_entity_1.World, world_tag_entity_1.WorldTag, world_item_entity_1.WorldItem, user_entity_1.User])],
        providers: [worlds_service_1.WorldsService, world_items_service_1.WorldItemsService],
        controllers: [worlds_controller_1.WorldsController, world_items_controller_1.WorldItemsController],
        exports: [worlds_service_1.WorldsService],
    })
], WorldsModule);
