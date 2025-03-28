import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { DatabaseModule } from '../../database/database.module';
import { Messageproviders } from './message.providers';


@Module({
  imports: [forwardRef(() => DatabaseModule)],
  controllers: [MessageController],
  providers: [MessageService, ...Messageproviders],
  exports: [MessageService]
})
export class MessageModule {}
