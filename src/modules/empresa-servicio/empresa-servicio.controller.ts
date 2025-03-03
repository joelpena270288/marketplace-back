import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpresaServicioService } from './empresa-servicio.service';
import { CreateEmpresaServicioDto } from './dto/create-empresa-servicio.dto';
import { UpdateEmpresaServicioDto } from './dto/update-empresa-servicio.dto';

@Controller('empresa-servicio')
export class EmpresaServicioController {
  constructor(private readonly empresaServicioService: EmpresaServicioService) {}

  @Post()
  create(@Body() createEmpresaServicioDto: CreateEmpresaServicioDto) {
    return this.empresaServicioService.create(createEmpresaServicioDto);
  }

  @Get()
  findAll() {
    return this.empresaServicioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empresaServicioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpresaServicioDto: UpdateEmpresaServicioDto) {
    return this.empresaServicioService.update(+id, updateEmpresaServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empresaServicioService.remove(+id);
  }
}
