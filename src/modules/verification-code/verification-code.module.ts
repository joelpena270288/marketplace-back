import { Module } from '@nestjs/common';
import { VerificationService } from './verification-code.service';
import { VerificationCodeController } from './verification-code.controller';
import { VerificationCodeProviders } from './verification-code.providers';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [VerificationCodeController],
  providers: [VerificationService, ...VerificationCodeProviders],
  exports: [VerificationService]
})
export class VerificationCodeModule {}
