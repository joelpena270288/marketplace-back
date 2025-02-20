import { Test, TestingModule } from '@nestjs/testing';
import { PromosionService } from './promosion.service';

describe('PromosionService', () => {
  let service: PromosionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PromosionService],
    }).compile();

    service = module.get<PromosionService>(PromosionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
