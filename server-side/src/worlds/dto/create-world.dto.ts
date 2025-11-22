import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsArray()
  @IsString({ each: true })
  contributors?: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ obj, key }) => {
    // obj — це "сирий" об'єкт запиту. Там лежить рядок "false".
    // Ми ігноруємо `value`, бо Nest його вже зіпсував.

    const rawValue = obj[key]; // Дістаємо "false" (string)

    console.log(`🔍 FIX TRANSFORM. Raw: [${rawValue}]`); // Для перевірки

    if (rawValue === 'true' || rawValue === true) return true;
    if (rawValue === 'false' || rawValue === false) return false;

    return rawValue;
  })
  isPublic?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  coAuthorIds?: string[];
}
