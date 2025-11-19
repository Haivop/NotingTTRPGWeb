import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { WorldItemsService } from './world-items.service';
import { WorldsService } from '../worlds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateWorldItemDto } from './dto/update-world-item.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@Controller('world-items')
export class WorldItemsController {
  constructor(
    private readonly worldItemsService: WorldItemsService,
    private readonly worldsService: WorldsService,
  ) {}

  @Get(':itemId')
  @UseGuards(OptionalJwtAuthGuard)
  async getItem(@Param('itemId') itemId: string, @CurrentUser() user?: JwtPayload) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanView(item.worldId, user?.sub);
    return this.worldItemsService.toResponse(item);
  }

  @Patch(':itemId')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateWorldItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);
    return this.worldItemsService.update(item.worldId, item.id, dto);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async deleteItem(@Param('itemId') itemId: string, @CurrentUser() user: JwtPayload) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);
    return this.worldItemsService.remove(item.worldId, item.id);
  }
}
