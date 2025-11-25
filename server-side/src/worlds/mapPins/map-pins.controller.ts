import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { MapPinsService } from '../mapPins/map-pins.Service';
import { CreateMapPinDto } from './dto/create-map-dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WorldsService } from '../worlds.service';

@Controller()
export class MapPinsController {
  constructor(
    private readonly mapPinsService: MapPinsService,
    private readonly worldsService: WorldsService,
  ) {}

  @Get('worlds/:worldId/pins')
  @UseGuards(OptionalJwtAuthGuard)
  async getPins(@Param('worldId') worldId: string, @CurrentUser() user?: JwtPayload) {
    await this.worldsService.ensureCanView(worldId, user?.sub);
    return this.mapPinsService.findAllByWorld(worldId);
  }

  @Post('worlds/:worldId/pins')
  @UseGuards(JwtAuthGuard)
  async createPin(
    @Param('worldId') worldId: string,
    @Body() dto: CreateMapPinDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.worldsService.ensureCanEdit(worldId, user.sub);

    return this.mapPinsService.create(worldId, dto);
  }

  @Delete('pins/:pinId')
  @UseGuards(JwtAuthGuard)
  async deletePin(@Param('pinId') pinId: string, @CurrentUser() user: JwtPayload) {
    const pin = await this.mapPinsService.findOne(pinId);
    await this.worldsService.ensureCanEdit(pin.worldId, user.sub);

    return this.mapPinsService.remove(pinId);
  }
}
