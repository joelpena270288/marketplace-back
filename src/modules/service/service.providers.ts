import { Service } from './entities/service.entity';
import { DataSource } from 'typeorm';

export const serviceProviders = [
  {
    provide: 'SERVICE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Service),
    inject: ['DATA_SOURCE'],
  },
];
