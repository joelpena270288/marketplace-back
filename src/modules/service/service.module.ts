import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { serviceProviders } from './service.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ServiceController],
  providers: [ServiceService, ...serviceProviders],
  exports: [ServiceService],
})
export class ServiceModule {}
