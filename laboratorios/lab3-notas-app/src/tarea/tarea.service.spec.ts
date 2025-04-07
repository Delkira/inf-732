import { Test, TestingModule } from '@nestjs/testing';
import { TareaService } from './tarea.service';
import { ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarea } from './tarea.entity';
import { NotFoundException } from '@nestjs/common';

const mockNotaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockTarea = {
  id: 1,
  title: 'Test Tarea',
  content: 'Test Content',
};

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('TareaService', () => {
  let service: TareaService;
  let repository: MockRepository<Tarea>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TareaService,
        {
          provide: getRepositoryToken(Tarea),
          useValue: mockNotaRepository(),
        },
      ],
    }).compile();

    service = module.get<TareaService>(TareaService);
    repository = module.get<MockRepository<Tarea>>(getRepositoryToken(Tarea));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  

  it('Deberia crear una nueva tarea', async () => {
    jest.spyOn(repository, 'save').mockResolvedValue(mockTarea as Tarea);

    const result = await service.create({
      title: 'Test Tarea',
      content: 'Test Content',
    });
    expect(result).toEqual(mockTarea);

    expect(repository.create).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
  });

  it('Deberia encontrar todas las tareas', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockTarea] as Tarea[]);

    const result = await service.findAll();
    expect(result).toEqual([mockTarea]);

    expect(repository.find).toHaveBeenCalled();
  });

  describe('findOne', () => {
    describe('cuando la tarea existe', () => {
      it('deberia encontrar una tarea por id', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockTarea as Tarea);

        const id: number = 1;
        const result = await service.findOne(id);
        expect(result).toEqual(mockTarea);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
    describe('cuando la tarea NO existe', () => {
      it('deberia lanzar una excepcion', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

        const id: number = 999;
        await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
  });

  describe('update (modificar una tarea)', () => {
    describe('cuando la tarea existe', () => {
      it('deberia modificar una tarea', async () => {
        const id = 1;
        const updateTareaDto = {
          title: 'Updated Tarea',
        };
        const tareaActualizada = {
          ...mockTarea,
          ...updateTareaDto,
        } as Tarea;

        const updateResult = {
          affected: 1,
          raw: {},
          generatedMaps: [],
        } as UpdateResult;
        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
        jest.spyOn(service, 'findOne').mockResolvedValue(tareaActualizada);

        const result = await service.update(id, updateTareaDto);

        expect(repository.update).toHaveBeenCalledWith(id, updateTareaDto);
        expect(service.findOne).toHaveBeenCalledWith(id);
        expect(result).toEqual(tareaActualizada);
      });
    });

    describe('cuando la tarea no existe', () => {
      it('deberia lanzar NotFoundException si la tarea no exite', async () => {
        const id = 999;
        const updateTareaDto = {
          title: 'Updated Tarea',
        };
        const updateResult = {
          affected: 0,
          raw: {},
          generatedMaps: [],
        } as UpdateResult;
    
        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
    
        await expect(service.update(id, updateTareaDto)).rejects.toThrow(
          NotFoundException,
        );
    
        expect(repository.update).toHaveBeenCalledWith(id, updateTareaDto);
      });
    });
  });

  describe('eliminar tarea)', () => {
    describe('cuando la tarea existe', () => {
      it('deberia eliminar la tarea', async () => {
        const id = 1;
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 });

        await service.remove(id);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });

    describe('cuando la tarea no existe', () => {
      it('deberia lanzar NotFoundException si la tarea no existe', async () => {
        const id = 999;
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 });

        await expect(service.remove(id)).rejects.toThrow(NotFoundException);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });
  });
  
  describe('findByTitle', () => {
    describe('cuando existen tareas con el título buscado', () => {
      it('debería devolver las tareas ', async () => {
        const title = 'Test Tarea';
        const tareasEncontradas = [{ ...mockTarea, title }]; 
  
        jest.spyOn(repository, 'find').mockResolvedValue(tareasEncontradas as Tarea[]); 
  
        const result = await service.findByTitle(title);
  
        expect(result).toEqual(tareasEncontradas);
        expect(repository.find).toHaveBeenCalledWith({ where: { title } });
      });
    });
  
    describe('cuando no existen tareas con el título buscado', () => {
      it('debería lanzar una excepción NotFoundException si no existen tareas', async () => {
        const title = 'Test Tarea';
        jest.spyOn(repository, 'find').mockResolvedValue([]); 
  
        await expect(service.findByTitle(title)).rejects.toThrow(NotFoundException); 
  
        expect(repository.find).toHaveBeenCalledWith({ where: { title } });
      });
    });
  });
  
});