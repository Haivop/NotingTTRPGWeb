import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWorldDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  mapUrl?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  era?: string;

  @IsOptional()
  @IsString()
  themes?: string;

  @IsOptional()
  @IsString()
  startingRegion?: string;

  @IsOptional()
  @IsString()
  contributors?: string;

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  coAuthorIds?: string[];
}
