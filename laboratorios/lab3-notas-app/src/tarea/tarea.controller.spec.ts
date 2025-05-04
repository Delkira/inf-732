import { Test, TestingModule } from '@nestjs/testing';
import { TareaController } from './tarea.controller';
import { TareaService } from './tarea.service';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Tarea } from './tarea.entity';
import { NotFoundException } from '@nestjs/common';

describe('TareaController', () => {
  let controller: TareaController;
  let service: TareaService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      findByTitle: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TareaController],
      providers: [
        {
          provide: TareaService,
          useValue: mockService,
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

  describe('create', () => {
    it('Deberia crear una tarea', async () => {
      const mockTarea: Tarea = {
        id: 1,
        title: 'Tarea 1',
        content: 'Contenido de la tarea 1',
        completed: false,
        createdAt: new Date(),
      };
      const createTareaDto: CreateTareaDto = {
        title: 'Tara 1',
        content: 'Contenido de la tarea 1',
      };
      // Simulate that the service returns the created task
      jest.spyOn(service, 'create').mockResolvedValue(mockTarea);

      const result = await controller.create(createTareaDto);

      expect(result).toEqual(mockTarea);
      expect(service.create).toHaveBeenCalledWith(createTareaDto);
    });
  });

  describe('findAll', () => {
    it('Deberia retornar todas las tareas', async () => {
      const mockTareas: Tarea[] = [
        {
          id: 1,
          title: 'Tarea 1',
          content: 'Contenido de la tarea 1',
          completed: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Tarea 2',
          content: 'Contenido de la tarea 2',
          completed: false,
          createdAt: new Date(),
        },
      ];
      // Simulate that the service returns all tasks
      jest.spyOn(service, 'findAll').mockResolvedValue(mockTareas);

      const result = await controller.findAll();

      expect(result).toEqual(mockTareas);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('Deberia retornar una tarea si existe', async () => {
      const mockTarea: Tarea = {
        id: 1,
        title: 'Tarea 1',
        content: 'Contenido de la tarea 1',
        completed: false,
        createdAt: new Date(),
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockTarea);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockTarea);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('Deberia actualizar una tarea si existe', async () => {
      const mockTarea: Tarea = {
        id: 1,
        title: 'Tarea 1',
        content: 'Contenido de la tarea 1',
        completed: false,
        createdAt: new Date(),
      };
      const updateTareaDto: CreateTareaDto = {
        title: 'Tarea 1 Actualizada',
        content: 'Contenido de la tarea 1 actualizado',
      };

      jest.spyOn(service, 'update').mockResolvedValue(mockTarea);

      const result = await controller.update('1', updateTareaDto);

      expect(result).toEqual(mockTarea);
      expect(service.update).toHaveBeenCalledWith(1, updateTareaDto);
    });

    it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('999', {title:'Tarea no existe', content: 'Contenido no existe'})).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, {title:'Tarea no existe', content: 'Contenido no existe'});
    });
  });

  describe('remove', () => {
    it('Deberia eliminar una tarea si existe', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('findByTitle', () => {
    it('Deberia retornar una tarea por su titulo', async () => {
      const mockTarea: Tarea[] = [
        {
          id: 1,
          title: 'Tarea 1',
          content: 'Contenido de la tarea 1',
          completed: false,
          createdAt: new Date(),
        },
        {
          id: 2,
          title: 'Tarea 2',
          content: 'Contenido de la tarea 2',
          completed: false,
          createdAt: new Date(),
        },
      ];

      jest.spyOn(service, 'findByTitle').mockResolvedValue(mockTarea);

      const result = await controller.findByTitle('Tarea 1');

      expect(result).toEqual(mockTarea);
      expect(service.findByTitle).toHaveBeenCalledWith('Tarea 1');
    });
    it('Deberia lanzar NotFoundException si no se encuentra la tarea por su titulo', async () => {
      jest.spyOn(service, 'findByTitle').mockRejectedValue(new NotFoundException());

      await expect(controller.findByTitle('Tarea no existe')).rejects.toThrow(NotFoundException);
      expect(service.findByTitle).toHaveBeenCalledWith('Tarea no existe');
    });
  });
});
