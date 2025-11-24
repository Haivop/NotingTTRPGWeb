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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async create(data) {
        const user = this.usersRepository.create({
            username: data.username,
            email: data.email,
            passwordHash: data.passwordHash,
        });
        return this.usersRepository.save(user);
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async checkExistenceByEmail(email) {
        const user = await this.findByEmail(email);
        return !!user;
    }
    async update(id, dto) {
        const user = await this.findById(id);
        if (dto.username && dto.username !== user.username) {
            const existing = await this.usersRepository.findOne({ where: { username: dto.username } });
            if (existing) {
                throw new common_1.BadRequestException('Username already taken');
            }
            user.username = dto.username;
        }
        if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
            const existing = await this.usersRepository.findOne({
                where: { email: dto.email.toLowerCase() },
            });
            if (existing) {
                throw new common_1.BadRequestException('Email already in use');
            }
            user.email = dto.email.toLowerCase();
        }
        return this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
