import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTareaDto } from './dto/create-tarea.dto';
import { Tarea } from './tarea.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TareaService {
    constructor(
        @InjectRepository(Tarea)
        private readonly tareaRepository: Repository<Tarea>,
    ) {}

    async create(createTareaDto: CreateTareaDto): Promise<Tarea> {
            const newTarea = this.tareaRepository.create(createTareaDto);
            return this.tareaRepository.save(newTarea);
        }
    async findAll(): Promise<Tarea[]> {
        return this.tareaRepository.find();
    }
    async findOne(id: number): Promise<Tarea> {
        const tarea = await this.tareaRepository.findOneBy({ id });
        if (!tarea) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
        return tarea;
    }
    async update(id: number, updateTareaDto: Partial<Tarea>): Promise<Tarea> {
        await this.tareaRepository.update(id, updateTareaDto);
        return this.findOne(id);
    }
    async remove(id: number): Promise<void> {
        const result = await this.tareaRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Tarea con ID ${id} no encontrada`);
        }
    }
    async findByTitle(title: string): Promise<Tarea[]> {
        const tareas = await this.tareaRepository.find({ where: { title: Like(`%${title}%`) } });
        if (tareas.length === 0) {
            throw new NotFoundException(`Tarea con el título ${title} no encontrada`);
        }
        return tareas; 
    }

}
