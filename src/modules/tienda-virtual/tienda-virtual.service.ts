import { Injectable } from '@nestjs/common';
import { CreateTiendaVirtualDto } from './dto/create-tienda-virtual.dto';
import { UpdateTiendaVirtualDto } from './dto/update-tienda-virtual.dto';

@Injectable()
export class TiendaVirtualService {
  create(createTiendaVirtualDto: CreateTiendaVirtualDto) {
    return 'This action adds a new tiendaVirtual';
  }

  findAll() {
    return `This action returns all tiendaVirtual`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tiendaVirtual`;
  }

  update(id: number, updateTiendaVirtualDto: UpdateTiendaVirtualDto) {
    return `This action updates a #${id} tiendaVirtual`;
  }

  remove(id: number) {
    return `This action removes a #${id} tiendaVirtual`;
  }
}
