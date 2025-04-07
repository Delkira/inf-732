import { Test, TestingModule } from '@nestjs/testing';
import { TareaController } from './tarea.controller';
import { TareaService } from './tarea.service';

const mockTarea = {
  id: 1,
  title: 'Test Tarea',
  content: 'Test Content',
};

const createTareaDto = {
  title: 'New Tarea',
  content: 'New Content',
};

const updateTareaDto = {
  title: 'Título actualizado',
  content: 'Contenido actualizado',
};

describe('TareaController', () => {
  let controller: TareaController;
  let service: TareaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareaController],
      providers: [
        {
          provide: TareaService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockTarea),
            findOne: jest.fn().mockResolvedValue(mockTarea),
            findAll: jest.fn().mockResolvedValue([mockTarea]),
            findByTitle: jest.fn().mockResolvedValue([mockTarea]),
            update: jest.fn().mockResolvedValue(mockTarea),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TareaController>(TareaController);
    service = module.get<TareaService>(TareaService);

    // Limpiar los mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
