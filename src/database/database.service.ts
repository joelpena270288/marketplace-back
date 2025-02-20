import { ConfigService } from '../config/config.service';
import { DataSource } from 'typeorm';
import { Configuration } from '../config/config.keys';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const config: ConfigService = new ConfigService();
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.get(Configuration.DATABASE_HOST),
        port: 5432,
        username: config.get(Configuration.DATABASE_USERNAME),
        password: config.get(Configuration.DATABASE_PASSWORD),
        database: config.get(Configuration.DATABASE_NAME),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + './migrations/*{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
