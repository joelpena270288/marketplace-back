import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TiendaVirtualService } from './tienda-virtual.service';
import { CreateTiendaVirtualDto } from './dto/create-tienda-virtual.dto';
import { UpdateTiendaVirtualDto } from './dto/update-tienda-virtual.dto';

@Controller('tienda-virtual')
export class TiendaVirtualController {
  constructor(private readonly tiendaVirtualService: TiendaVirtualService) {}

  @Post()
  create(@Body() createTiendaVirtualDto: CreateTiendaVirtualDto) {
    return this.tiendaVirtualService.create(createTiendaVirtualDto);
  }

  @Get()
  findAll() {
    return this.tiendaVirtualService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiendaVirtualService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTiendaVirtualDto: UpdateTiendaVirtualDto) {
    return this.tiendaVirtualService.update(+id, updateTiendaVirtualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiendaVirtualService.remove(+id);
  }
}
