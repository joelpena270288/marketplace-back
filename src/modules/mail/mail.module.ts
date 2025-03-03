import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { DatabaseModule } from '../../database/database.module';

import { VerificationCodeModule } from '../verification-code/verification-code.module';


@Module({
  imports: [DatabaseModule, VerificationCodeModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
