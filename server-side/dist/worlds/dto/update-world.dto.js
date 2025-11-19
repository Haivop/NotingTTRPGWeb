"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWorldDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_world_dto_1 = require("./create-world.dto");
class UpdateWorldDto extends (0, mapped_types_1.PartialType)(create_world_dto_1.CreateWorldDto) {
}
exports.UpdateWorldDto = UpdateWorldDto;
