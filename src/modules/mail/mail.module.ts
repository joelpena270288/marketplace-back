import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { DatabaseModule } from '../../database/database.module';
import { VerificationCodeModule } from '../verification-code/verification-code.module';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [ConfigModule, DatabaseModule, VerificationCodeModule],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
