import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promocion } from './entities/promocion.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promocion, Servicio])],
  controllers: [PromocionesController],
  providers: [PromocionesService],
  exports: [PromocionesService],
})
export class PromocionesModule {}
