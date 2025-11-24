import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { WorldItemsService } from './world-items.service';
import { WorldsService } from '../worlds.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateWorldItemDto } from './dto/update-world-item.dto';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(AnyFilesInterceptor())
  async updateItem(
    @Param('itemId') itemId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body(
      new ValidationPipe({
        forbidNonWhitelisted: false,
        whitelist: true,
      }),
    )
    dto: UpdateWorldItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const imageFile = files.find((f) => f.fieldname === 'image');
    const galleryFiles = files.filter((f) => f.fieldname === 'galleryImages');
    console.log(galleryFiles);

    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);

    return this.worldItemsService.update(item.worldId, item.id, dto, imageFile, galleryFiles);
  }

  @Delete(':itemId')
  @UseGuards(JwtAuthGuard)
  async deleteItem(@Param('itemId') itemId: string, @CurrentUser() user: JwtPayload) {
    const item = await this.worldItemsService.getAny(itemId);
    await this.worldsService.ensureCanEdit(item.worldId, user.sub);
    return this.worldItemsService.remove(item.worldId, item.id);
  }
}
