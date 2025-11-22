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
exports.UpdateWorldItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_world_item_dto_1 = require("./create-world-item.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateWorldItemDto extends (0, mapped_types_1.PartialType)(create_world_item_dto_1.CreateWorldItemDto) {
}
exports.UpdateWorldItemDto = UpdateWorldItemDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWorldItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateWorldItemDto.prototype, "payload", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== undefined),
    __metadata("design:type", Array)
], UpdateWorldItemDto.prototype, "existingGalleryImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWorldItemDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.ValidateIf)((object, value) => value !== undefined),
    __metadata("design:type", Array)
], UpdateWorldItemDto.prototype, "galleryImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateWorldItemDto.prototype, "type", void 0);
