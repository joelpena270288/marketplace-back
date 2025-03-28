import { Test, TestingModule } from '@nestjs/testing';
import { ComunityPostService } from './comunity-post.service';

describe('ComunityPostService', () => {
  let service: ComunityPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunityPostService],
    }).compile();

    service = module.get<ComunityPostService>(ComunityPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
