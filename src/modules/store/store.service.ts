import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';

@Injectable()
export class StoreService {
  constructor(
    @Inject('STORE_REPOSITORY')
    private storeRepository: Repository<Store>,
  ) {}

  async findAll(): Promise<Store[]> {
    return await this.storeRepository.find();
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id },
    });
    if (!store) {
      throw new NotFoundException('Tienda no encontrada');
    }
    return store;
  }

  async updateStatus(id: string, status: string): Promise<Store> {
    const store = await this.findOne(id);
    store.status = status;
    return await this.storeRepository.save(store);
  }

  async create(name: string, description?: string): Promise<Store> {
    const store = this.storeRepository.create({
      name,
      description,
      status: 'ACTIVO',
    });
    return await this.storeRepository.save(store);
  }
}
