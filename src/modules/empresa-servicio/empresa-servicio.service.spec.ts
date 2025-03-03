import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaServicioService } from './empresa-servicio.service';

describe('EmpresaServicioService', () => {
  let service: EmpresaServicioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmpresaServicioService],
    }).compile();

    service = module.get<EmpresaServicioService>(EmpresaServicioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
