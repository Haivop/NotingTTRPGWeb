"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
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
    async create(worldId, dto, imageFile, galleryFiles) {
        let imageUrl = null;
        let galleryImages = [];
        if (imageFile) {
            imageUrl = await this.saveFile(imageFile);
        }
        if (galleryFiles && galleryFiles.length > 0) {
            galleryImages = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
        }
        const item = this.worldItemsRepository.create({
            worldId,
            ...dto,
            imageUrl,
            galleryImages,
        });
        return this.worldItemsRepository.save(item);
    }
    async update(worldId, itemId, dto, imageFile, galleryFiles) {
        const item = await this.worldItemsRepository.findOne({ where: { id: itemId, worldId } });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        let uploadedNewFiles = [];
        const oldGalleryImages = item.galleryImages || [];
        let filesToKeep = [];
        if (imageFile) {
            if (item.imageUrl) {
                await this.deleteFile(item.imageUrl);
            }
            item.imageUrl = await this.saveFile(imageFile);
        }
        if (galleryFiles && galleryFiles.length > 0) {
            uploadedNewFiles = await Promise.all(galleryFiles.map((file) => this.saveFile(file)));
            console.log('[GALLERY] Uploaded new files:', uploadedNewFiles);
        }
        const requiredToKeep = new Set(dto.existingGalleryImages || []);
        const allPossibleFileNames = [...oldGalleryImages, ...uploadedNewFiles];
        const keptOldFiles = oldGalleryImages.filter((fileName) => requiredToKeep.has(fileName));
        filesToKeep = [...keptOldFiles, ...uploadedNewFiles];
        const filesToDelete = oldGalleryImages.filter((fileName) => !requiredToKeep.has(fileName));
        if (filesToDelete.length > 0) {
            await Promise.all(filesToDelete.map((fileName) => this.deleteFile(fileName)));
        }
        if (dto.name)
            item.name = dto.name;
        if (dto.type)
            item.type = dto.type;
        if (dto.payload)
            item.payload = { ...item.payload, ...dto.payload };
        item.galleryImages = filesToKeep;
        console.log(filesToKeep);
        const saved = await this.worldItemsRepository.save(item);
        return this.toResponse(saved);
    }
    async deleteFile(fileName) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        const filePath = path.join(uploadDir, fileName);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(`[DELETE] Successfully deleted file: ${fileName}`);
            }
            catch (error) {
                console.error(`[DELETE] Failed to delete file ${fileName}:`, error);
            }
        }
        else {
            console.warn(`[DELETE] File not found on disk: ${fileName}`);
        }
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
            imageUrl: item.imageUrl,
            galleryImages: item.galleryImages || [],
            payload: item.payload,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    }
    async saveFile(file) {
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const fileExt = path.extname(file.originalname);
        const fileName = `${(0, uuid_1.v4)()}${fileExt}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        return fileName;
    }
};
exports.WorldItemsService = WorldItemsService;
exports.WorldItemsService = WorldItemsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(world_item_entity_1.WorldItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], WorldItemsService);
