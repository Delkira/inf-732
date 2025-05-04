import { Repository } from 'typeorm';
import { TareaService } from './tarea.service';
import { Tarea } from './tarea.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

describe('Tareas Integration Tests', () => {
    let service: TareaService;
    let repository: Repository<Tarea>;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'admin',
            database: 'tareas_test',
            entities: [Tarea],
            synchronize: true,
        }),
            TypeOrmModule.forFeature([Tarea]),
        ],
        providers: [TareaService],
    }).compile();
    service = module.get<TareaService>(TareaService);
    repository = module.get<Repository<Tarea>>(getRepositoryToken(Tarea));
    });

    afterAll(async () => {
        const connection = repository.manager.connection;
        if (connection.isInitialized) {
        await connection.destroy();
        }
    });

    afterEach(async () => {
        await repository.query('DELETE FROM tarea;');
    });

    //creamos una tarea en la base de datos
    it('Deberia crear una tarea en la base de datos', async () => {
        const nuevaTarea = {
            title: 'Tarea de prueba',
            content: 'Contenido de la tarea de prueba',
        };
        const tareaCreada = await service.create(nuevaTarea); 

        //verificar la respuesta del servicio
        expect(tareaCreada).toHaveProperty('id');
        expect(tareaCreada.title).toBe(nuevaTarea.title);
        expect(tareaCreada.content).toBe(nuevaTarea.content);

        //verificar que la nota fue guardada en la base de datos
        const tareaEnDB = await repository.findOneBy({ id: tareaCreada.id });
        expect(tareaEnDB).not.toBeNull();
        if (tareaEnDB) {
            expect(tareaEnDB.title).toBe(nuevaTarea.title);
            expect(tareaEnDB.content).toBe(nuevaTarea.content);
        }
    });

    //Mostramos todas las tareas de la base de datos
    it('Deberia mostrar todas las tareas de la base de datos', async () => {
        await repository.save([
            { title: 'Tarea 1', content: 'Contenido de la tarea 1' },
            { title: 'Tarea 2', content: 'Contenido de la tarea 2' },
        ]);

        const tareas = await service.findAll();
        expect(tareas.length).toBe(2);
        expect(tareas[0].title).toBe('Tarea 1');
        expect(tareas[1].title).toBe('Tarea 2');
    });

    //Mostramos una tarea por id
    describe('findOne()', () => {
        it('Deberia mostrar una tarea por id', async () => {
            const nuevaTarea = await repository.save({
                title: 'Tarea especifica',
                content: 'Contenido especifico',
            });
    
            const tareaEncontarda = await service.findOne(nuevaTarea.id);
            expect(tareaEncontarda).toBeDefined();
            expect(tareaEncontarda.title).toEqual('Tarea especifica');
            expect(tareaEncontarda.content).toEqual('Contenido especifico');
        });
        it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
            const tareaNoExiste = 9999;
            try {
                await service.findOne(tareaNoExiste);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

    //Actualizamos una tarea
    describe('update()', () => {
        it('Deberia actualizar una tarea existente', async () => {
            const nuevaTarea = await repository.save({
                title: 'Tarea antes de actualizar',
                content: 'Contenido antes de actualizar',
            });

            const tareaActualizada = await service.update(nuevaTarea.id, {
                title: 'Tarea actualizada',
                content: 'Contenido actualizado',
            });

            expect(tareaActualizada).toBeDefined();
            expect(tareaActualizada.title).toEqual('Tarea actualizada');
            expect(tareaActualizada.content).toEqual('Contenido actualizado');

            const tareaEnDB = await repository.findOneBy({ id: nuevaTarea.id });
            expect(tareaEnDB).not.toBeNull();
            if (tareaEnDB) {
                expect(tareaEnDB.title).toEqual(tareaActualizada.title);
                expect(tareaEnDB.content).toEqual(tareaActualizada.content);
            }
        });
        it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
            const tareaNoExiste = 9999;
            try {
                await service.update(tareaNoExiste, {
                    title: 'Tarea actualizada',
                    content: 'Contenido actualizado',
                });
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

    //Eliminamos una tarea
    describe('remove()', () => {
        it('Deberia eliminar una tarea existente', async () => {
            const tareaExiste = await repository.save({
                title: 'Tarea para eliminar',
                content: 'Contenido para eliminar',
            });

            await service.remove(tareaExiste.id);

            const tareaEliminada = await repository.findOneBy({ id: tareaExiste.id });
            expect(tareaEliminada).toBeNull();
        });
        it('Deberia lanzar NotFoundException si la tarea no existe', async () => {
            const idNoExiste = 9999;
            await expect(service.remove(idNoExiste)).rejects.toThrow(NotFoundException);
        });
    });

    //Buscamos por titulo
    describe('findByTitle()', () => {
        it('Deberia retornar tareas por titulo', async () => {
            const tareas = await repository.save([
                { title: 'Tarea 1', content: 'Contenido de la tarea 1' },
                { title: 'Tarea 2', content: 'Contenido de la tarea 2' },
            ]);

            //hacer la busqueda por titulo
            const resultado = await service.findByTitle('Tarea 1');
            //verificar que el resultado es el esperado
            expect(resultado.length).toBe(1);
            expect(resultado[0].title).toBe(tareas[0].title);
        });
        it('Deberia lanzar NotFoundException si no se encuentra ninguna tarea', async () => {
            const tituloNoExiste = 'Tarea que no existe';
            try {
                await service.findByTitle(tituloNoExiste);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
            }
        });
    });

});