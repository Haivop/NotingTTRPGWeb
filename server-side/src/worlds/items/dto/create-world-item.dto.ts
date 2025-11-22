import { IsObject, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWorldItemDto {
  @IsString()
  type: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return {};
      }
    }
    return value;
  })
  payload?: Record<string, any>;
}
