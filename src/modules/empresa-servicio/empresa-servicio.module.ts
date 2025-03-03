import { Module } from '@nestjs/common';
import { EmpresaServicioService } from './empresa-servicio.service';
import { EmpresaServicioController } from './empresa-servicio.controller';

@Module({
  controllers: [EmpresaServicioController],
  providers: [EmpresaServicioService],
})
export class EmpresaServicioModule {}
