import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWorldItemDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  payload?: Record<string, any>;
}
