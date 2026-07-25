import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { User } from '../users/entities/user.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { Especialidad } from '../especialidades/entities/especialidad.entity';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, User, Servicio, Especialidad])],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports: [EmpleadosService],
})
export class EmpleadosModule {}
