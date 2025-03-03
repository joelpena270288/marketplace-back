import { Test, TestingModule } from '@nestjs/testing';
import { TiendaVirtualController } from './tienda-virtual.controller';
import { TiendaVirtualService } from './tienda-virtual.service';

describe('TiendaVirtualController', () => {
  let controller: TiendaVirtualController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiendaVirtualController],
      providers: [TiendaVirtualService],
    }).compile();

    controller = module.get<TiendaVirtualController>(TiendaVirtualController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
