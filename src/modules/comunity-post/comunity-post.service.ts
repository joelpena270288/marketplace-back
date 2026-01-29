import { Injectable } from '@nestjs/common';
import { CreateComunityPostDto } from './dto/create-comunity-post.dto';
import { UpdateComunityPostDto } from './dto/update-comunity-post.dto';

@Injectable()
export class ComunityPostService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_createComunityPostDto: CreateComunityPostDto) {
    return 'This action adds a new comunityPost';
  }

  findAll() {
    return `This action returns all comunityPost`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comunityPost`;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, _updateComunityPostDto: UpdateComunityPostDto) {
    return `This action updates a #${id} comunityPost`;
  }

  remove(id: number) {
    return `This action removes a #${id} comunityPost`;
  }
}
