import { Test, TestingModule } from '@nestjs/testing';
import { MisionService } from './mision.service';

describe('MisionService', () => {
  let service: MisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MisionService],
    }).compile();

    service = module.get<MisionService>(MisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
