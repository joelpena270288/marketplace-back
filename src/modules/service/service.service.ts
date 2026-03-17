import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private serviceRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException('Servicio no encontrado');
    }
    return service;
  }

  async updateStatus(id: string, status: string): Promise<Service> {
    const service = await this.findOne(id);
    service.status = status;
    return await this.serviceRepository.save(service);
  }

  async create(name: string, price: number, description?: string): Promise<Service> {
    const service = this.serviceRepository.create({
      name,
      price,
      description,
      status: 'ACTIVO',
    });
    return await this.serviceRepository.save(service);
  }
}
