import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Cobro } from '../cobros/entities/cobro.entity';
import { User } from '../users/entities/user.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Cobro, User, Empleado, Servicio])],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}
