import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { World } from '../entities/world.entity';
import { WorldTag } from '../entities/world-tag.entity';
import { WorldItem } from '../entities/world-item.entity';
import { WorldsService } from './worlds.service';
import { WorldsController } from './worlds.controller';
import { WorldItemsService } from './items/world-items.service';
import { WorldItemsController } from './items/world-items.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([World, WorldTag, WorldItem, User])],
  providers: [WorldsService, WorldItemsService],
  controllers: [WorldsController, WorldItemsController],
  exports: [WorldsService],
})
export class WorldsModule {}
