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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const tokens_service_1 = require("../tokens/tokens.service");
const crypto_1 = require("crypto");
const ms_1 = __importDefault(require("ms"));
const SALT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService, tokensService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokensService = tokensService;
    }
    async register(dto) {
        const existingByEmail = await this.usersService.findByEmail(dto.email.toLowerCase());
        if (existingByEmail) {
            throw new common_1.BadRequestException('Email already registered');
        }
        const existingByUsername = await this.usersService.findByUsername(dto.username);
        if (existingByUsername) {
            throw new common_1.BadRequestException('Username already taken');
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
        const user = await this.usersService.create({
            username: dto.username,
            email: dto.email.toLowerCase(),
            passwordHash,
        });
        return this.issueSession(user);
    }
    async login(dto) {
        var _a;
        const normalized = dto.identifier.trim();
        const user = (_a = (await this.usersService.findByEmail(normalized.toLowerCase()))) !== null && _a !== void 0 ? _a : (await this.usersService.findByUsername(normalized));
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.issueSession(user);
    }
    async refresh(dto) {
        const payload = await this.verifyRefreshToken(dto.refreshToken);
        const user = await this.usersService.findById(payload.sub);
        await this.tokensService.revokeToken(payload.jti);
        return this.issueSession(user);
    }
    async logout(dto) {
        const payload = await this.verifyRefreshToken(dto.refreshToken);
        await this.tokensService.revokeToken(payload.jti);
        return { success: true };
    }
    async issueSession(user) {
        const { accessToken, refreshToken, refreshTokenId, refreshExpiresAt } = await this.generateTokens(user);
        const hashedRefresh = await bcrypt.hash(refreshToken, SALT_ROUNDS);
        await this.tokensService.persistRefreshToken({
            userId: user.id,
            tokenHash: hashedRefresh,
            tokenId: refreshTokenId,
            expiresAt: refreshExpiresAt,
        });
        return {
            user: this.toPublicUser(user),
            tokens: {
                accessToken,
                refreshToken,
            },
        };
    }
    async verifyRefreshToken(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            if (!payload.jti) {
                throw new common_1.UnauthorizedException('Refresh token malformed');
            }
            const persisted = await this.tokensService.findRefreshToken(payload.jti);
            if (!persisted) {
                throw new common_1.UnauthorizedException('Refresh token revoked');
            }
            const matches = await bcrypt.compare(refreshToken, persisted.tokenHash);
            if (!matches) {
                throw new common_1.UnauthorizedException('Refresh token invalid');
            }
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    toPublicUser(user) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    async generateTokens(user) {
        const refreshTokenId = (0, crypto_1.randomUUID)();
        const accessPayload = { sub: user.id, username: user.username };
        const refreshPayload = { sub: user.id, username: user.username, jti: refreshTokenId };
        const accessToken = await this.jwtService.signAsync(accessPayload, {
            secret: this.configService.get('jwt.accessSecret'),
            expiresIn: this.configService.get('jwt.accessTtl'),
        });
        const refreshTtl = this.configService.get('jwt.refreshTtl');
        const refreshToken = await this.jwtService.signAsync(refreshPayload, {
            secret: this.configService.get('jwt.refreshSecret'),
            expiresIn: refreshTtl,
        });
        const expiresInMs = (0, ms_1.default)(refreshTtl !== null && refreshTtl !== void 0 ? refreshTtl : '7d');
        const refreshExpiresAt = new Date(Date.now() + expiresInMs);
        return { accessToken, refreshToken, refreshTokenId, refreshExpiresAt };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        tokens_service_1.TokensService])
], AuthService);
