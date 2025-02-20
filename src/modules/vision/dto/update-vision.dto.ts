import { PartialType } from '@nestjs/swagger';
import { CreateVisionDto } from './create-vision.dto';

export class UpdateVisionDto extends PartialType(CreateVisionDto) {}
