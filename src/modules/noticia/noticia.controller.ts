import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NoticiaService } from './noticia.service';
import { CreateNoticiaDto } from './dto/create-noticia.dto';
import { UpdateNoticiaDto } from './dto/update-noticia.dto';

@Controller('noticia')
export class NoticiaController {
  constructor(private readonly noticiaService: NoticiaService) {}

  @Post()
  create(@Body() createNoticiaDto: CreateNoticiaDto) {
    return this.noticiaService.create(createNoticiaDto);
  }

  @Get()
  findAll() {
    return this.noticiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticiaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticiaDto: UpdateNoticiaDto) {
    return this.noticiaService.update(+id, updateNoticiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticiaService.remove(+id);
  }
}
