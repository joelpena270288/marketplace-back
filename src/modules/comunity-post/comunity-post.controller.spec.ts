import { Test, TestingModule } from '@nestjs/testing';
import { ComunityPostController } from './comunity-post.controller';
import { ComunityPostService } from './comunity-post.service';

describe('ComunityPostController', () => {
  let controller: ComunityPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunityPostController],
      providers: [ComunityPostService],
    }).compile();

    controller = module.get<ComunityPostController>(ComunityPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
