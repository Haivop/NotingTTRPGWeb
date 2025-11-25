import { IsNotEmpty, IsNumber, IsString, IsUUID, Min, Max, IsOptional } from 'class-validator';

export class CreateMapPinDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  x: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  y: number;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  customLabel?: string;
}
