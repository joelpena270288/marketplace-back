import { Injectable } from '@nestjs/common';
import { CreateComunityPostDto } from './dto/create-comunity-post.dto';
import { UpdateComunityPostDto } from './dto/update-comunity-post.dto';

@Injectable()
export class ComunityPostService {
  create(createComunityPostDto: CreateComunityPostDto) {
    return 'This action adds a new comunityPost';
  }

  findAll() {
    return `This action returns all comunityPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comunityPost`;
  }

  update(id: number, updateComunityPostDto: UpdateComunityPostDto) {
    return `This action updates a #${id} comunityPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} comunityPost`;
  }
}
