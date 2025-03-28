import { Module } from '@nestjs/common';
import { ComunityPostService } from './comunity-post.service';
import { ComunityPostController } from './comunity-post.controller';

@Module({
  controllers: [ComunityPostController],
  providers: [ComunityPostService],
})
export class ComunityPostModule {}
