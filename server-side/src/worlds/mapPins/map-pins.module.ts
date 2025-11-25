import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapPin } from '../../entities/map-pin.entity';
import { MapPinsController } from './map-pins.controller';
import { MapPinsService } from '../mapPins/map-pins.Service';
import { WorldsModule } from '../worlds.module';

@Module({
  imports: [TypeOrmModule.forFeature([MapPin]), WorldsModule],
  controllers: [MapPinsController],
  providers: [MapPinsService],
  exports: [MapPinsService],
})
export class MapPinsModule {}
