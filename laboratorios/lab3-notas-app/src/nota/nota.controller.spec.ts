import { Test, TestingModule } from '@nestjs/testing';
import { NotasController } from './nota.controller';
import { NotasService } from './nota.service';
import { NotFoundException } from '@nestjs/common';

const mockNota = {
  id: 1,
  title: 'Test Nota',
  content: 'Test Content',
};

const createNotaDto = {
  title: 'New Nota',
  content: 'New Content',
};

const updateNotaDto = {
  title: 'Título actualizado',
  content: 'Contenido actualizado',
};

describe('NotasController', () => {
  let controller: NotasController;
  let service: NotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotasController],
      providers: [
        {
          provide: NotasService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockNota),
            findOne: jest.fn().mockResolvedValue(mockNota),
            findAll: jest.fn().mockResolvedValue([mockNota]),
            findByTitle: jest.fn().mockResolvedValue([mockNota]),
            update: jest.fn().mockResolvedValue(mockNota),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<NotasController>(NotasController);
    service = module.get<NotasService>(NotasService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});