import { Repository } from 'typeorm';
import { NotasService } from './nota.service';
import { Nota } from './nota.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Notas Integration Tests', () => {
    let service: NotasService;
    let repository: Repository<Nota>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin',
            database: 'notas_test',
            entities: [Nota],
            synchronize: true,
        }),
            TypeOrmModule.forFeature([Nota]),
        ],
        providers: [NotasService],
    }).compile();
    service = module.get<NotasService>(NotasService);
    repository = module.get<Repository<Nota>>(getRepositoryToken(Nota));
    });

    afterAll(async () => {
        const connection = repository.manager.connection;
        if (connection.isInitialized) {
        await connection.destroy();
        }
    });

    afterEach(async () => {
        await repository.query('DELETE FROM nota;');
    });

    //creamos una nota en la base de datos
    it('Deberia crear una nota en la base de datos', async () => {
        const nuevaNota = {
            title: 'Nota de prueba',
            content: 'Contenido de la nota de prueba',
        };
        const notaCreada = await service.create(nuevaNota); 

        //verificar la respuesta del servicio
        expect(notaCreada).toHaveProperty('id');
        expect(notaCreada.title).toBe(nuevaNota.title);
        expect(notaCreada.content).toBe(nuevaNota.content);

        //verificar que la nota fue guardada en la base de datos
        const notaEnDB = await repository.findOneBy({ id: notaCreada.id });
        expect(notaEnDB).not.toBeNull();
        if (notaEnDB) {
            expect(notaEnDB.title).toBe(nuevaNota.title);
            expect(notaEnDB.content).toBe(nuevaNota.content);
        }
    });

    //Mostramos todas las notas de la base de datos
    it('Deberia mostrar todas las notas de la base de datos', async () => {
        await repository.save([
            { title: 'Nota 1', content: 'Contenido de la nota 1' },
            { title: 'Nota 2', content: 'Contenido de la nota 2' },
        ]);

        const notas = await service.findAll();
        expect(notas.length).toBe(2);
        expect(notas[0].title).toBe('Nota 1');
        expect(notas[1].title).toBe('Nota 2');
    });

    //Mostramos una nota por id
    describe('findOne()', () => {
        it('Deberia mostrar una nota por id', async () => {
            const nuevaNota = await repository.save({
                title: 'Nota especifica',
                content: 'Contenido especifico',
            });
    
            const notaEncontarda = await service.findOne(nuevaNota.id);
            expect(notaEncontarda).toBeDefined();
            expect(notaEncontarda.title).toEqual('Nota especifica');
            expect(notaEncontarda.content).toEqual('Contenido especifico');
        });
        it('Deberia lanzar NotFoundException si la nota no existe', async () => {
            const notaNoExiste = 9999;
            try {
                await service.findOne(notaNoExiste);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });


    //Actualizamos una nota
    describe('update()', () => {
        it('Deberia actualizar una nota existente', async () => {
            const nuevaNota = await repository.save({
                title: 'Nota antes de actualizar',
                content: 'Contenido antes de actualizar',
            });

            const notaActualizada = await service.update(nuevaNota.id, {
                title: 'Nota actualizada',
                content: 'Contenido actualizado',
            });

            expect(notaActualizada).toBeDefined();
            expect(notaActualizada.title).toEqual('Nota actualizada');
            expect(notaActualizada.content).toEqual('Contenido actualizado');

            const notaEnDB = await repository.findOneBy({ id: nuevaNota.id });
            expect(notaEnDB).not.toBeNull();
            if (notaEnDB) {
                expect(notaEnDB.title).toEqual(notaActualizada.title);
                expect(notaEnDB.content).toEqual(notaActualizada.content);
            }
        });
        it('Deberia lanzar NotFoundException si la nota no existe', async () => {
            const notaNoExiste = 9999;
            try {
                await service.update(notaNoExiste, {
                    title: 'Nota actualizada',
                    content: 'Contenido actualizado',
                });
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

    //Eliminamos una nota
    describe('remove()', () => {
        it('Deberia eliminar una nota existente', async () => {
            const notaExiste = await repository.save({
                title: 'Nota para eliminar',
                content: 'Contenido para eliminar',
            });

            await service.remove(notaExiste.id);

            const notaEliminada = await repository.findOneBy({ id: notaExiste.id });
            expect(notaEliminada).toBeNull();
        });
        it('Deberia lanzar NotFoundException si la nota no existe', async () => {
            const idNoExiste = 9999;
            await expect(service.remove(idNoExiste)).rejects.toThrow(NotFoundException);
        });
    });

    //Buscamos por titulo
    describe('findByTitle()', () => {
        it('Deberia retornar notas por titulo', async () => {
            const notas = await repository.save([
                { title: 'Nota 1', content: 'Contenido de la nota 1' },
                { title: 'Nota 2', content: 'Contenido de la nota 2' },
            ]);

            //hacer la busqueda por titulo
            const resultado = await service.findByTitle('Nota 1');
            //verificar que el resultado es el esperado
            expect(resultado.length).toBe(1);
            expect(resultado[0].title).toBe(notas[0].title);
        });
        it('Deberia lanzar NotFoundException si no se encuentra ninguna nota', async () => {
            const tituloNoExiste = 'Nota que no existe';
            try {
                await service.findByTitle(tituloNoExiste);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

});