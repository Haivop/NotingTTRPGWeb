import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CreateWorldDto } from './create-world.dto';
import { Transform } from 'class-transformer';

export class UpdateWorldDto extends PartialType(CreateWorldDto) {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return [value];
    }

    return value;
  })
  contributors?: string[];
}
