import { DataSource } from 'typeorm';
import {Notification} from './entities/notification.entity';
export const NotificationProviders = [
    {
        provide: 'NOTIFICATION_REPOSITORY',
        useFactory: (dataSource: DataSource)=>dataSource.getRepository(Notification),
        inject: ['DATA_SOURCE'],
    }
];