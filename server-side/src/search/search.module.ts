import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { World } from '../entities/world.entity';
import { WorldItem } from '../entities/world-item.entity';
import { WorldTag } from '../entities/world-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([World, WorldItem, WorldTag])],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
