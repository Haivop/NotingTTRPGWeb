"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorldItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_world_item_dto_1 = require("./create-world-item.dto");
class UpdateWorldItemDto extends (0, mapped_types_1.PartialType)(create_world_item_dto_1.CreateWorldItemDto) {
}
exports.UpdateWorldItemDto = UpdateWorldItemDto;
