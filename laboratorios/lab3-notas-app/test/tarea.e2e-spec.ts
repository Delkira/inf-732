import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tarea } from '../src/tarea/tarea.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTareaDto } from 'src/tarea/dto/create-tarea.dto';
import { create } from 'domain';

describe('TareaController (e2e)', () => {
    let app: INestApplication;
    let tareaRepository: Repository<Tarea>;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
        );
        tareaRepository = moduleFixture.get<Repository<Tarea>>(
        getRepositoryToken(Tarea),
        );

        await app.init();
    });

    afterAll(async () => {
        await app.close();
        const dataSource = app.get(DataSource);
        if (dataSource.isInitialized) {
        await dataSource.destroy();
        }
    });

    afterEach(async () => {
        await tareaRepository.clear();
    });

    describe('/tareas (POST)', () => {
        it('debería crear una nueva tarea', async () => {
        const createTareaDto = {
            title: 'Tarea de prueba',
            content: 'Este es el contenido de prueba',
        };

        const response = await request(app.getHttpServer())
            .post('/tarea')
            .send(createTareaDto)
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual(createTareaDto.title);
        expect(response.body.content).toEqual(createTareaDto.content);
        });

        it('debería fallar si no se proporciona el título', async () => {
        const invalidDto = {
            content: 'Content without title',
        } as CreateTareaDto;

        const response = await request(app.getHttpServer())
            .post('/tarea')
            .send(invalidDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('The title is required');
        });

        it('deberia fallar si no se proporciona el contenido', async () => {
        const invalidDto = {
            title: 'Title without content',
        } as CreateTareaDto;

        const response = await request(app.getHttpServer())
            .post('/tarea')
            .send(invalidDto);

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('The content is required');
        });
    });


    describe('/tareas (GET)', () => {
        it('debería devolver todas las tareas', async () => {
        const createTareaDto1 = {
            title: 'Tarea de prueba',
            content: 'Este es el contenido de prueba',
            completed: false,
            createdAt: new Date(),
        };
        const createTareaDto2 = {
            title: 'Otra tarea de prueba',
            content: 'Este es otro contenido de prueba',
            completed: false,
            createdAt: new Date(),
        };
        await tareaRepository.save(createTareaDto1);
        await tareaRepository.save(createTareaDto2);

        const response = await request(app.getHttpServer())
            .get('/tarea')
            .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].title).toEqual(createTareaDto1.title);
        expect(response.body[0].content).toEqual(createTareaDto1.content);
        });
    });

    describe('/tareas/:id (GET)', () => {
        it('debería devolver una tarea por ID', async () => {
        const createTareaDto = {
            title: 'Tarea de prueba',
            content: 'Este es el contenido de prueba',
        };
        const tarea = await tareaRepository.save(createTareaDto);

        const response = await request(app.getHttpServer())
            .get(`/tarea/${tarea.id}`)
            .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual(createTareaDto.title);
        expect(response.body.content).toEqual(createTareaDto.content);
        });

        it('debería devolver un error 404 si la tarea no existe', async () => {
        const response = await request(app.getHttpServer())
            .get('/tarea/999')
            .expect(404);

        expect(response.body.message).toContain('Tarea con ID 999 no encontrada');
        });
    });

    describe('/tareas/:id (PUT)', () => {
        it('debería actualizar una tarea existente', async () => {
        const createTareaDto = {
            title: 'Tarea de prueba',
            content: 'Este es el contenido de prueba',
            completed: false,
        };
        const tarea = await tareaRepository.save(createTareaDto);

        const updateTareaDto = {
            title: 'Tarea actualizada',
            content: 'Contenido actualizado',
            completed: true,
        };

        const response = await request(app.getHttpServer())
            .put(`/tarea/${tarea.id}`)
            .send(updateTareaDto)
            .expect(200);

        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toEqual(updateTareaDto.title);
        expect(response.body.content).toEqual(updateTareaDto.content);
        });

        it('debería devolver un error 404 si la tarea no existe', async () => {
        const updateNotaDto = {
            title: 'Tarea actualizada',
            content: 'Contenido actualizado',
            completed: true,
        };

        const response = await request(app.getHttpServer())
            .put('/tarea/999')
            .send(updateNotaDto)
            .expect(404);

        expect(response.body.message).toContain('Tarea con ID 999 no encontrada');
        });
    });

    describe('/tareas/:id (DELETE)', () => {
        it('debería eliminar una tarea existente', async () => {
        const createTareaDto = {
            title: 'Tarea de prueba',
            content: 'Este es el contenido de prueba',
            completed: false,
            createdAt: new Date(),
        };
        const tarea = await tareaRepository.save(createTareaDto);

        const response = await request(app.getHttpServer())
        .delete(`/tarea/${tarea.id}`)
        .expect(200);

        });

        it('debería devolver un error 404 si la tarea no existe', async () => {
        const response = await request(app.getHttpServer())
            .delete('/tarea/999')
            .expect(404);

        expect(response.body.message).toContain('Tarea con ID 999 no encontrada');
        });
    });

    describe('/tareas/:title (GET)', () => {
        it('deberia devolver una lista de notas por título', async () => {
        const createTareaDto1 = {
            title: 'Tarea prueba',
            content: 'Este es el contenido de prueba',
        };
        const createTareaDto2 = {
            title: 'Otra Tarea de prueba',
            content: 'Este es otro contenido de prueba',
        };
        await tareaRepository.save(createTareaDto1);
        await tareaRepository.save(createTareaDto2);

        const response = await request(app.getHttpServer())
            .get('/tarea/titulo/Tarea prueba')
            .expect(200);
        
        expect(response.body).toHaveLength(1);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0].title).toEqual(createTareaDto1.title);
        expect(response.body[0].content).toEqual(createTareaDto1.content);
        });
        it('debería devolver un error 404 si no se encuentran tareas con el título dado', async () => {
        const response = await request(app.getHttpServer())
            .get('/tarea/titulo/inexistente')
            .expect(404);

        expect(response.body.message).toContain('Tarea con el título inexistente no encontrada');
        });
    })

});