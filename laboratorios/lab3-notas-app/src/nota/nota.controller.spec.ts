import { Test, TestingModule } from '@nestjs/testing';
import { NotasController } from './nota.controller';
import { NotasService } from './nota.service';
import { NotFoundException } from '@nestjs/common';
import { CreateNotaDto } from './dto/create-nota.dto';
import { UpdateNotaDto } from './dto/update-nota.dto';
import { Nota } from './nota.entity';

describe ('NotasController', () => {
  let controller: NotasController;
  let service: NotasService;

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
      controllers: [NotasController],
      providers: [
        {
          provide: NotasService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotasController>(NotasController);
    service = module.get<NotasService>(NotasService);

    jest.clearAllMocks();
  });

  it('deberia estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it ('deberia crear una nota', async () => {
      const mockNota: Nota = {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido de la nota 1',
      };
      const CreateNotaDto: CreateNotaDto = {
        title: 'Nota 1',
        content: 'Contenido de la nota 1',
      };
      //simulamos que el servicio devuelve la nota creada
      jest.spyOn(service, 'create').mockResolvedValue(mockNota);
  
      const result = await controller.create(CreateNotaDto);
  
      expect(result).toEqual(mockNota);
      expect(service.create).toHaveBeenCalledWith(CreateNotaDto);
  });

  describe('findOne', () => {
    it('deberia retornar una nota si existe', async () => {
      const mockNota = {
        id: 1,
        title: 'Test Nota',
        content: 'This is a test nota',
      };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNota);
  
      const result = await controller.findOne('1');
  
      expect(result).toEqual(mockNota);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
  
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('findAll', () => {
    it('deberia retornar todas las notas', async () => {
      const mockNotas: Nota[] = [
        {
          id: 1,
          title: 'Test Nota 1',
          content: 'This is a test nota 1',
        },
        {
          id: 2,
          title: 'Test Nota 2',
          content: 'This is a test nota 2',
        },
      ]
  
      jest.spyOn(service, 'findAll').mockResolvedValue(mockNotas);
  
      const result = await controller.findAll();
  
      expect(result).toEqual(mockNotas);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deberia actualizar una nota existente', async () => {
      const mockNota = {
        id: 1,
        title: 'Test Nota',
        content: 'This is a test nota',
      };
      const UpdateNotaDto: UpdateNotaDto = {
        title: 'Updated Test Nota'
      };
  
      jest.spyOn(service, 'update').mockResolvedValue(mockNota);
  
      const result = await controller.update('1', UpdateNotaDto);
  
      expect(result).toEqual(mockNota);
      expect(service.update).toHaveBeenCalledWith(1, UpdateNotaDto);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
  
      await expect(controller.update('999', {title:'Nota no esiste'})).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, {title:'Nota no esiste'});
    });
  });

  describe('remove', () => {
    it('deberia eliminar una nota existente', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
  
      await controller.remove('1');
  
      expect(service.remove).toHaveBeenCalledWith(1);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
  
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
  });

  describe('findAll', () => {
    it('deberia retornar todas las notas', async () => {
      const mockNotas: Nota[] = [
        {
          id: 1,
          title: 'Test Nota 1',
          content: 'This is a test nota 1',
        },
        {
          id: 2,
          title: 'Test Nota 2',
          content: 'This is a test nota 2',
        },
      ];
  
      jest.spyOn(service, 'findAll').mockResolvedValue(mockNotas);
  
      const result = await controller.findAll();
  
      expect(result).toEqual(mockNotas);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deberia retornar una nota por id', async () => {
      const mockNota: Nota = {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido de la nota 1',
      };
  
      jest.spyOn(service, 'findOne').mockResolvedValue(mockNota);
  
      const result = await controller.findOne('1');
  
      expect(result).toEqual(mockNota);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
  
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('update', () => {
    it('deberia actualizar una nota existente', async () => {
      const mockNota: Nota = {
        id: 1,
        title: 'Nota 1',
        content: 'Contenido 1',
      };
      const UpdateNotaDto: UpdateNotaDto = {
        title: 'Nota actualizada',
      };
  
      jest.spyOn(service, 'update').mockResolvedValue(mockNota);
  
      const result = await controller.update('1', UpdateNotaDto);
  
      expect(result).toEqual(mockNota);
      expect(service.update).toHaveBeenCalledWith(1, UpdateNotaDto);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());
  
      await expect(controller.update('999', {title:'Nota no existe'})).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, {title:'Nota no existe'});
    });
  });

  describe('remove', () => {
    it('deberia eliminar una nota existente', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);
  
      await controller.remove('1');
  
      expect(service.remove).toHaveBeenCalledWith(1);
    });
    it('deberia lanzar NotFoundException si la nota no existe', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
  
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('findByTitle', () => {
    it('deberia retornar notas por titulo', async () => {
      const mockNotas: Nota[] = [
        {
          id: 1,
          title: 'Test Nota 1',
          content: 'This is a test nota 1',
        },
        {
          id: 2,
          title: 'Test Nota 2',
          content: 'This is a test nota 2',
        },
      ];
  
      jest.spyOn(service, 'findByTitle').mockResolvedValue(mockNotas);
  
      const result = await controller.findByTitle('Test Nota 1');
  
      expect(result).toEqual(mockNotas);
      expect(service.findByTitle).toHaveBeenCalledWith('Test Nota 1');
    });
    it('deberia lanzar NotFoundException si no se encuentran notas', async () => {
      jest.spyOn(service, 'findByTitle').mockRejectedValue(new NotFoundException());
  
      await expect(controller.findByTitle('No existe')).rejects.toThrow(NotFoundException);
      expect(service.findByTitle).toHaveBeenCalledWith('No existe');
    });
  });

});