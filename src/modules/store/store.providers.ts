import { Store } from './entities/store.entity';
import { DataSource } from 'typeorm';

export const storeProviders = [
  {
    provide: 'STORE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Store),
    inject: ['DATA_SOURCE'],
  },
];
