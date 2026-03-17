import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { storeProviders } from './store.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [StoreController],
  providers: [StoreService, ...storeProviders],
  exports: [StoreService],
})
export class StoreModule {}
