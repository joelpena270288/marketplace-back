import { PartialType } from '@nestjs/swagger';
import { CreateComunityPostDto } from './create-comunity-post.dto';

export class UpdateComunityPostDto extends PartialType(CreateComunityPostDto) {}
