import { PartialType } from '@nestjs/swagger';
import { CreatePromosionDto } from './create-promosion.dto';

export class UpdatePromosionDto extends PartialType(CreatePromosionDto) {}
