import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalculadoraModule } from './calculadora/calculadora.module';

@Module({
  imports: [CalculadoraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
