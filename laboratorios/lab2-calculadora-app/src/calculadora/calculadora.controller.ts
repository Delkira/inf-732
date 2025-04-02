import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CalculadoraService } from './calculadora.service';

@Controller('calculadora')
export class CalculadoraController {
  constructor(private readonly calculadoraService: CalculadoraService) {}

  @Get('sumar')
  sumar(
    @Query('sumando1', ParseIntPipe) sumando1: number,
    @Query('sumando2', ParseIntPipe) sumando2: number,
  ): number {
    return this.calculadoraService.sumar(sumando1, sumando2);
  }

  @Get('restar')
  restar(
    @Query('minuendo', ParseIntPipe) minuendo: number,
    @Query('sustraendo', ParseIntPipe) sustraendo: number,
  ): number {
    return this.calculadoraService.restar(minuendo, sustraendo);
  }
}