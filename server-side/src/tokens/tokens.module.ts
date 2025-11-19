import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from '../entities/auth-token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken])],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
