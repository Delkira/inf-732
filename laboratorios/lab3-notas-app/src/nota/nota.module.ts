import { Module } from '@nestjs/common';
import { NotasService } from './nota.service';
import { NotasController } from './nota.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nota } from './nota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nota])],
  providers: [NotasService],
  controllers: [NotasController],
})
export class NotaModule {}