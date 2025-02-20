import { DataSource } from 'typeorm';
import { VerificationCode } from './entities/verification-code.entity';
export const VerificationCodeProviders = [
  {
    provide: 'VERIFICATIONCODE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(VerificationCode),
    inject: ['DATA_SOURCE'],
  },
];
