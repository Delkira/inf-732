import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculadoraService {
    sumar(sumando1: number, sumando2: number): number {
        if (sumando1 < 0 || sumando2 < 0) {
          throw new Error('No se permiten números negativos');
        }
        return sumando1 + sumando2;
    }
    restar(minuendo: number, sustraendo: number): number {
        if (minuendo < 0 || sustraendo < 0) {
            throw new Error('No se permiten números negativos');
        }
        if (minuendo < sustraendo) {
            throw new Error('El minuendo debe ser mayor o igual al sustraendo');
        }
        return minuendo - sustraendo;
    }    
}
