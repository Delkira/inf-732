import { Module } from '@nestjs/common';
import { CalculadoraService } from './calculadora.service';
import { CalculadoraController } from './calculadora.controller';

@Module({
  providers: [CalculadoraService],
  controllers: [CalculadoraController]
})
export class CalculadoraModule {}
