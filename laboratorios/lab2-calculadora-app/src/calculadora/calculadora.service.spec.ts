import { Test, TestingModule } from '@nestjs/testing';
import { CalculadoraService } from './calculadora.service';

describe('CalculadoraService', () => {
  let service: CalculadoraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalculadoraService],
    }).compile();

    service = module.get<CalculadoraService>(CalculadoraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //sumar
  it('sumar 1 + 2 resulta 3', () => {
    expect(service.sumar(1, 2)).toBe(3);
  });

  it('lanza error si sumando1 es negativo', () => {
    expect(() => service.sumar(-1, 2)).toThrow(
      'No se permiten números negativos',
    );
  });

  it('lanza error si sumando2 es negativo', () => {
    expect(() => service.sumar(1, -2)).toThrow(
      'No se permiten números negativos',
    );
  });

  //restar
  it('restar 5 - 3 resulta 2', () => {
    expect(service.restar(5, 3)).toBe(2);
  });
  
  it('lanza error si el minuendo es negativo', () => {
    expect(() => service.restar(-5, 3)).toThrow(
      'No se permiten números negativos',
    );
  });
  
  it('lanza error si el sustraendo es negativo', () => {
    expect(() => service.restar(5, -3)).toThrow(
      'No se permiten números negativos',
    );
  });
  
  it('lanza error si el minuendo es menor que el sustraendo', () => {
    expect(() => service.restar(3, 5)).toThrow(
      'El minuendo debe ser mayor o igual al sustraendo',
    );
  });
  
});