import { Test, TestingModule } from '@nestjs/testing';
import { TiendaVirtualService } from './tienda-virtual.service';

describe('TiendaVirtualService', () => {
  let service: TiendaVirtualService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TiendaVirtualService],
    }).compile();

    service = module.get<TiendaVirtualService>(TiendaVirtualService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
