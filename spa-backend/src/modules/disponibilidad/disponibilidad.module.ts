import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disponibilidad } from './entities/disponibilidad.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { DisponibilidadService } from './disponibilidad.service';
import { DisponibilidadController } from './disponibilidad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilidad, Empleado])],
  controllers: [DisponibilidadController],
  providers: [DisponibilidadService],
  exports: [DisponibilidadService],
})
export class DisponibilidadModule {}
