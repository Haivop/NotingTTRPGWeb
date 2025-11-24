import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { WorldsService } from './worlds.service';
import { CreateWorldDto } from './dto/create-world.dto';
import { UpdateWorldDto } from './dto/update-world.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../common/guards/optional-jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WorldItemsService } from './items/world-items.service';
import { CreateWorldItemDto } from './items/dto/create-world-item.dto';
import { UpdateWorldItemDto } from './items/dto/update-world-item.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

@Controller('worlds')
export class WorldsController {
  constructor(
    private readonly worldsService: WorldsService,
    private readonly worldItemsService: WorldItemsService,
  ) {}

  @Get()
  getPublicWorlds(
    @Query('page') page = 1,
    @Query('limit') limit = 12,
    @Query('search') search?: string,
  ) {
    const sanitizedPage = Math.max(Number(page) || 1, 1);
    const sanitizedLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
    return this.worldsService.listPublicWorlds({
      page: sanitizedPage,
      limit: sanitizedLimit,
      search,
    });
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMyWorlds(@CurrentUser() user: JwtPayload) {
    return this.worldsService.listOwnedWorlds(user.sub);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  getWorld(@Param('id') worldId: string, @CurrentUser() user?: JwtPayload) {
    return this.worldsService.getWorld(worldId, user?.sub);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  createWorld(
    @Body() dto: CreateWorldDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.worldsService.createWorld(user.sub, dto, image);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateWorld(
    @Param('id') worldId: string,
    @Body() dto: UpdateWorldDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    if (dto.contributors) {
      if (!Array.isArray(dto.contributors)) {
        dto.contributors = [dto.contributors] as string[];
      }
    } else {
    }
    return this.worldsService.updateWorld(worldId, user.sub, dto, image);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteWorld(@Param('id') worldId: string, @CurrentUser() user: JwtPayload) {
    return this.worldsService.deleteWorld(worldId, user.sub);
  }

  @Get(':id/items')
  @UseGuards(OptionalJwtAuthGuard)
  async listItems(
    @Param('id') worldId: string,
    @Query('type') type?: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    await this.worldsService.ensureCanView(worldId, user?.sub);
    return this.worldItemsService.list(worldId, type);
  }

  @Get(':id/items/:itemId')
  @UseGuards(OptionalJwtAuthGuard)
  async getItem(
    @Param('id') worldId: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    await this.worldsService.ensureCanView(worldId, user?.sub);
    return this.worldItemsService.get(worldId, itemId);
  }

  @Post(':id/items')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'gallery', maxCount: 10 },
    ]),
  )
  async createItem(
    @Param('id') worldId: string,
    @Body() dto: CreateWorldItemDto,
    @CurrentUser() user: JwtPayload,
    @UploadedFiles() files: { image?: Express.Multer.File[]; gallery?: Express.Multer.File[] },
  ) {
    await this.worldsService.ensureCanEdit(worldId, user.sub);

    const mainImage = files?.image?.[0];
    const galleryImages = files?.gallery;

    return this.worldItemsService.create(worldId, dto, mainImage, galleryImages);
  }

  @Patch(':id/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @Param('id') worldId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateWorldItemDto,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.worldsService.ensureCanEdit(worldId, user.sub);
    return this.worldItemsService.update(worldId, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async deleteItem(
    @Param('id') worldId: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    await this.worldsService.ensureCanEdit(worldId, user.sub);
    return this.worldItemsService.remove(worldId, itemId);
  }
}
