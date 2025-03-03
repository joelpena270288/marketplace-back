import { Test, TestingModule } from '@nestjs/testing';
import { EmpresaServicioController } from './empresa-servicio.controller';
import { EmpresaServicioService } from './empresa-servicio.service';

describe('EmpresaServicioController', () => {
  let controller: EmpresaServicioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpresaServicioController],
      providers: [EmpresaServicioService],
    }).compile();

    controller = module.get<EmpresaServicioController>(EmpresaServicioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
