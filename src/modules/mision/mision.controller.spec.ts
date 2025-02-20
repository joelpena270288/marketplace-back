import { Test, TestingModule } from '@nestjs/testing';
import { MisionController } from './mision.controller';
import { MisionService } from './mision.service';

describe('MisionController', () => {
  let controller: MisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MisionController],
      providers: [MisionService],
    }).compile();

    controller = module.get<MisionController>(MisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
