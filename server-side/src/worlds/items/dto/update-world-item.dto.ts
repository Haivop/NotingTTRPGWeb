import { PartialType } from '@nestjs/mapped-types';
import { CreateWorldItemDto } from './create-world-item.dto';

export class UpdateWorldItemDto extends PartialType(CreateWorldItemDto) {}
