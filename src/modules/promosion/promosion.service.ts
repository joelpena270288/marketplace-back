import { Injectable } from '@nestjs/common';
import { CreatePromosionDto } from './dto/create-promosion.dto';
import { UpdatePromosionDto } from './dto/update-promosion.dto';

@Injectable()
export class PromosionService {
  create(createPromosionDto: CreatePromosionDto) {
    return 'This action adds a new promosion';
  }

  findAll() {
    return `This action returns all promosion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promosion`;
  }

  update(id: number, updatePromosionDto: UpdatePromosionDto) {
    return `This action updates a #${id} promosion`;
  }

  remove(id: number) {
    return `This action removes a #${id} promosion`;
  }
}
