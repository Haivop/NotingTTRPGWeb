import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthToken } from '../entities/auth-token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly tokenRepository: Repository<AuthToken>,
  ) {}

  async persistRefreshToken(params: {
    userId: string;
    tokenHash: string;
    tokenId: string;
    expiresAt: Date;
  }): Promise<AuthToken> {
    const entity = this.tokenRepository.create({
      userId: params.userId,
      tokenHash: params.tokenHash,
      tokenId: params.tokenId,
      type: 'refresh',
      expiresAt: params.expiresAt,
    });
    return this.tokenRepository.save(entity);
  }

  async findRefreshToken(tokenId: string): Promise<AuthToken | null> {
    return this.tokenRepository.findOne({ where: { tokenId, type: 'refresh' } });
  }

  async revokeToken(tokenId: string): Promise<void> {
    await this.tokenRepository.delete({ tokenId });
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.tokenRepository.delete({ userId });
  }
}
