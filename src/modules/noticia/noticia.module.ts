import { Module } from '@nestjs/common';
import { NoticiaService } from './noticia.service';
import { NoticiaController } from './noticia.controller';

@Module({
  controllers: [NoticiaController],
  providers: [NoticiaService],
})
export class NoticiaModule {}
