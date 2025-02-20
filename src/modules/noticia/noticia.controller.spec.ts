import { Test, TestingModule } from '@nestjs/testing';
import { NoticiaController } from './noticia.controller';
import { NoticiaService } from './noticia.service';

describe('NoticiaController', () => {
  let controller: NoticiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoticiaController],
      providers: [NoticiaService],
    }).compile();

    controller = module.get<NoticiaController>(NoticiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
