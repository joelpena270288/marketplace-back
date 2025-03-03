import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaServicioDto } from './create-empresa-servicio.dto';

export class UpdateEmpresaServicioDto extends PartialType(CreateEmpresaServicioDto) {}
