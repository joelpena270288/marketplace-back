import { Injectable } from '@nestjs/common';
import { CreateEmpresaServicioDto } from './dto/create-empresa-servicio.dto';
import { UpdateEmpresaServicioDto } from './dto/update-empresa-servicio.dto';

@Injectable()
export class EmpresaServicioService {
  create(createEmpresaServicioDto: CreateEmpresaServicioDto) {
    return 'This action adds a new empresaServicio';
  }

  findAll() {
    return `This action returns all empresaServicio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresaServicio`;
  }

  update(id: number, updateEmpresaServicioDto: UpdateEmpresaServicioDto) {
    return `This action updates a #${id} empresaServicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresaServicio`;
  }
}
