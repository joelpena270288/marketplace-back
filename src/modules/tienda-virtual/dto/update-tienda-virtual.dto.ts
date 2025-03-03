import { PartialType } from '@nestjs/swagger';
import { CreateTiendaVirtualDto } from './create-tienda-virtual.dto';

export class UpdateTiendaVirtualDto extends PartialType(CreateTiendaVirtualDto) {}
