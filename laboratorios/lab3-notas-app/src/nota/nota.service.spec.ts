import { Test, TestingModule } from '@nestjs/testing';
import { NotasService } from './nota.service';
import { Like, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { Nota } from './nota.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

const mockNotaRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockNota = {
  id: 1,
  title: 'Test Nota',
  content: 'Test Content',
};

type MockRepository<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

describe('NotasService', () => {
  let service: NotasService;
  let repository: MockRepository<Nota>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotasService,
        {
          provide: getRepositoryToken(Nota),
          useValue: mockNotaRepository(),
        },
      ],
    }).compile();

    service = module.get<NotasService>(NotasService);
    repository = module.get<MockRepository<Nota>>(getRepositoryToken(Nota));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Deberia crear una nueva nota', async () => {
    jest.spyOn(repository, 'save').mockResolvedValue(mockNota as Nota);

    const result = await service.create({
      title: 'Test Nota',
      content: 'Test Content',
    });
    expect(result).toEqual(mockNota);

    expect(repository.create).toHaveBeenCalled();
    expect(repository.create).toHaveBeenCalled();
  });

  it('Deberia encontrar todas las notas', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockNota] as Nota[]);

    const result = await service.findAll();
    expect(result).toEqual([mockNota]);

    expect(repository.find).toHaveBeenCalled();
  });

  describe('findOne', () => {
    describe('cuando la nota existe', () => {
      it('deberia encontrar una nota por id', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockNota as Nota);

        const id: number = 1;
        const result = await service.findOne(id);
        expect(result).toEqual(mockNota);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
    describe('cuando la nota NO existe', () => {
      it('deberia lanzar una excepcion', async () => {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

        const id: number = 999;
        await expect(service.findOne(id)).rejects.toThrow(NotFoundException);

        expect(repository.findOneBy).toHaveBeenCalledWith({ id });
      });
    });
  });

  describe('update (modificar una nota)', () => {
    describe('cuando la nota existe', () => {
      it('deberia modificar una nota', async () => {
        const id = 1;
        const updateNotaDto = {
          title: 'Updated Nota',
        };
        const notaActualizada = {
          ...mockNota,
          ...updateNotaDto,
        } as Nota;

        const updateResult = {
          affected: 1,
          raw: {},
          generatedMaps: [],
        } as UpdateResult;
        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
        jest.spyOn(service, 'findOne').mockResolvedValue(notaActualizada);

        const result = await service.update(id, updateNotaDto);

        expect(repository.update).toHaveBeenCalledWith(id, updateNotaDto);
        expect(service.findOne).toHaveBeenCalledWith(id);
        expect(result).toEqual(notaActualizada);
      });
    });

    describe('cuando la nota no existe', () => {
      it('deberia lanzar NotFoundException si la nota no exite', async () => {
        const id = 999;
        const updateNotaDto = {
          title: 'Updated Nota',
        };
        const updateResult = {
          affected: 0,
          raw: {},
          generatedMaps: [],
        } as UpdateResult;

        jest.spyOn(repository, 'update').mockResolvedValue(updateResult);
        jest.spyOn(service, 'findOne').mockImplementation();

        await expect(service.update(id, updateNotaDto)).rejects.toThrow(
          NotFoundException,
        );

        expect(repository.update).toHaveBeenCalledWith(id, updateNotaDto);
        expect(service.findOne).not.toHaveBeenCalled();
      });
    });
  });

  describe('eliminar nota)', () => {
    describe('cuando la nota existe', () => {
      it('deberia eliminar la nota', async () => {
        const id = 1;
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 });

        await service.remove(id);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });

    describe('cuando la nota no existe', () => {
      it('deberia lanzar NotFoundException si la nota no existe', async () => {
        const id = 999;
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 });

        await expect(service.remove(id)).rejects.toThrow(NotFoundException);

        expect(repository.delete).toHaveBeenCalledWith(id);
      });
    });
  });

  describe('findByTitle', () => {
    it('deberia encontrar una nota por titulo', async () => {
      const title = 'Test Nota';
      jest.spyOn(repository, 'find').mockResolvedValue([mockNota] as Nota[]);

      const result = await service.findByTitle(title);
      expect(result).toEqual([mockNota]);

      expect(repository.find).toHaveBeenCalledWith({ where: { title: Like(`%${title}%`) } });
    });

    it('deberia lanzar NotFoundException si no se encuentra la nota', async () => {
      const title = 'Nota Inexistente';
      jest.spyOn(repository, 'find').mockResolvedValue([]);

      await expect(service.findByTitle(title)).rejects.toThrow(
        NotFoundException,
      );

      expect(repository.find).toHaveBeenCalledWith({ where: { title: Like(`%${title}%`),} });
    });
  });
});