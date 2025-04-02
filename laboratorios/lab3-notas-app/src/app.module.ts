import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotaModule } from './nota/nota.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Nota } from './nota/nota.entity';
import { TareaModule } from './tarea/tarea.module';
import { Tarea } from './tarea/tarea.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'notas_db',
      entities: [Nota, Tarea],
      synchronize: true,
    }),
    ConfigModule.forRoot({isGlobal:true}),
    NotaModule,
    TareaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
