import { Module } from '@nestjs/common';
import { TiendaVirtualService } from './tienda-virtual.service';
import { TiendaVirtualController } from './tienda-virtual.controller';

@Module({
  controllers: [TiendaVirtualController],
  providers: [TiendaVirtualService],
})
export class TiendaVirtualModule {}
