import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokensService } from '../tokens/tokens.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../entities/user.entity';
import { randomUUID } from 'crypto';
import ms from 'ms';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
  ) {}

  async register(dto: RegisterDto) {
    const existingByEmail = await this.usersService.findByEmail(dto.email.toLowerCase());
    if (existingByEmail) {
      throw new BadRequestException('Email already registered');
    }

    const existingByUsername = await this.usersService.findByUsername(dto.username);
    if (existingByUsername) {
      throw new BadRequestException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email.toLowerCase(),
      passwordHash,
    });

    return this.issueSession(user);
  }

  async login(dto: LoginDto) {
    const normalized = dto.identifier.trim();
    const user =
      (await this.usersService.findByEmail(normalized.toLowerCase())) ??
      (await this.usersService.findByUsername(normalized));

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession(user);
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.usersService.findById(payload.sub);

    await this.tokensService.revokeToken(payload.jti);

    return this.issueSession(user);
  }

  async logout(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    await this.tokensService.revokeToken(payload.jti);
    return { success: true };
  }

  async issueSession(user: User) {
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

  private async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      if (!payload.jti) {
        throw new UnauthorizedException('Refresh token malformed');
      }

      const persisted = await this.tokensService.findRefreshToken(payload.jti);
      if (!persisted) {
        throw new UnauthorizedException('Refresh token revoked');
      }

      const matches = await bcrypt.compare(refreshToken, persisted.tokenHash);
      if (!matches) {
        throw new UnauthorizedException('Refresh token invalid');
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private toPublicUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  private async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const accessPayload: JwtPayload = { sub: user.id, username: user.username };
    const refreshPayload: JwtPayload = { sub: user.id, username: user.username, jti: refreshTokenId };

    const accessToken = await this.jwtService.signAsync(accessPayload, {
      secret: this.configService.get<string>('jwt.accessSecret'),
      expiresIn: this.configService.get<string>('jwt.accessTtl'),
    });

    const refreshTtl = this.configService.get<string>('jwt.refreshTtl');
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: refreshTtl,
    });

    const expiresInMs = ms(refreshTtl ?? '7d');
    const refreshExpiresAt = new Date(Date.now() + expiresInMs);

    return { accessToken, refreshToken, refreshTokenId, refreshExpiresAt };
  }
}
