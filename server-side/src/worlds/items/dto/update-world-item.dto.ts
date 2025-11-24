import { PartialType } from '@nestjs/mapped-types';
import { CreateWorldItemDto } from './create-world-item.dto';
import { IsOptional, IsString, IsArray, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateWorldItemDto extends PartialType(CreateWorldItemDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  payload?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }
    return value;
  })
  @ValidateIf((object, value) => value !== undefined)
  existingGalleryImages?: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf((object, value) => value !== undefined)
  galleryImages?: string[];

  @IsOptional()
  @IsString()
  type?: string;
}
