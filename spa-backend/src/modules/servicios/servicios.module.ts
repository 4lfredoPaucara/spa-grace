import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servicio } from './entities/servicio.entity';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { ServiciosService } from './servicios.service';
import { ServiciosController } from './servicios.controller';
import { CategoriasService } from './categorias.service';
import { CategoriasController } from './categorias.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Servicio, CategoriaServicio])],
  controllers: [ServiciosController, CategoriasController],
  providers: [ServiciosService, CategoriasService],
  exports: [ServiciosService, CategoriasService],
})
export class ServiciosModule {}
