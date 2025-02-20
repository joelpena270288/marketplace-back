import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromosionService } from './promosion.service';
import { CreatePromosionDto } from './dto/create-promosion.dto';
import { UpdatePromosionDto } from './dto/update-promosion.dto';

@Controller('promosion')
export class PromosionController {
  constructor(private readonly promosionService: PromosionService) {}

  @Post()
  create(@Body() createPromosionDto: CreatePromosionDto) {
    return this.promosionService.create(createPromosionDto);
  }

  @Get()
  findAll() {
    return this.promosionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promosionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromosionDto: UpdatePromosionDto) {
    return this.promosionService.update(+id, updatePromosionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promosionService.remove(+id);
  }
}
