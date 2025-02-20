import { Injectable } from '@nestjs/common';
import { CreateMisionDto } from './dto/create-mision.dto';
import { UpdateMisionDto } from './dto/update-mision.dto';

@Injectable()
export class MisionService {
  create(createMisionDto: CreateMisionDto) {
    return 'This action adds a new mision';
  }

  findAll() {
    return `This action returns all mision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mision`;
  }

  update(id: number, updateMisionDto: UpdateMisionDto) {
    return `This action updates a #${id} mision`;
  }

  remove(id: number) {
    return `This action removes a #${id} mision`;
  }
}
