import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComunityPostService } from './comunity-post.service';
import { CreateComunityPostDto } from './dto/create-comunity-post.dto';
import { UpdateComunityPostDto } from './dto/update-comunity-post.dto';

@Controller('comunity-post')
export class ComunityPostController {
  constructor(private readonly comunityPostService: ComunityPostService) {}

  @Post()
  create(@Body() createComunityPostDto: CreateComunityPostDto) {
    return this.comunityPostService.create(createComunityPostDto);
  }

  @Get()
  findAll() {
    return this.comunityPostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comunityPostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComunityPostDto: UpdateComunityPostDto) {
    return this.comunityPostService.update(+id, updateComunityPostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comunityPostService.remove(+id);
  }
}
