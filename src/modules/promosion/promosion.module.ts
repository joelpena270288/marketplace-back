import { Module } from '@nestjs/common';
import { PromosionService } from './promosion.service';
import { PromosionController } from './promosion.controller';

@Module({
  controllers: [PromosionController],
  providers: [PromosionService],
})
export class PromosionModule {}
