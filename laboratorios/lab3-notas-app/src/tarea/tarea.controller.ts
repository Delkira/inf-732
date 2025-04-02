import { Controller, Post, Get, Body, Put, Param, Delete } from '@nestjs/common'; // Agregado Body, Post y Get
import { TareaService } from './tarea.service';
import { Tarea } from './tarea.entity';
import { CreateTareaDto } from './dto/create-tarea.dto'; // Asegúrate de que este archivo exista

@Controller('tarea')
export class TareaController {
    constructor(private readonly tareaService: TareaService) {} // Eliminado paréntesis adicional

    @Post()
    async create(@Body() createTareaDto: CreateTareaDto): Promise<Tarea> {
        return this.tareaService.create(createTareaDto);
    }
    
    @Get()
    async findAll(): Promise<Tarea[]> {
        return this.tareaService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Tarea> {
        return this.tareaService.findOne(+id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateTareaDto: CreateTareaDto): Promise<Tarea> { // Cambiado UpdateTareaDto a CreateTareaDto
        return this.tareaService.update(+id, updateTareaDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.tareaService.remove(+id);
    }
}