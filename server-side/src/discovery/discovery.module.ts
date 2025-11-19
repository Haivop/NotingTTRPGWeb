import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { World } from '../entities/world.entity';
import { WorldItem } from '../entities/world-item.entity';
import { SiteContent } from '../entities/site-content.entity';
import { DiscoveryService } from './discovery.service';
import { DiscoveryController } from './discovery.controller';

@Module({
  imports: [TypeOrmModule.forFeature([World, WorldItem, SiteContent])],
  providers: [DiscoveryService],
  controllers: [DiscoveryController],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
