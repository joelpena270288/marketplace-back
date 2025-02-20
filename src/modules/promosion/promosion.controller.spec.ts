import { Test, TestingModule } from '@nestjs/testing';
import { PromosionController } from './promosion.controller';
import { PromosionService } from './promosion.service';

describe('PromosionController', () => {
  let controller: PromosionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromosionController],
      providers: [PromosionService],
    }).compile();

    controller = module.get<PromosionController>(PromosionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
