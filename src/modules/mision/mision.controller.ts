import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MisionService } from './mision.service';
import { CreateMisionDto } from './dto/create-mision.dto';
import { UpdateMisionDto } from './dto/update-mision.dto';

@Controller('mision')
export class MisionController {
  constructor(private readonly misionService: MisionService) {}

  @Post()
  create(@Body() createMisionDto: CreateMisionDto) {
    return this.misionService.create(createMisionDto);
  }

  @Get()
  findAll() {
    return this.misionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.misionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMisionDto: UpdateMisionDto) {
    return this.misionService.update(+id, updateMisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.misionService.remove(+id);
  }
}
