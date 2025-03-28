import { DataSource } from 'typeorm';
import { Message } from './entities/message.entity';
export const Messageproviders = [
        {
    provide: 'MESSAGE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Message),
    inject: ['DATA_SOURCE'],
    }
];