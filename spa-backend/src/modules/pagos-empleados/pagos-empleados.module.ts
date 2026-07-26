import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagoEmpleado } from './entities/pago-empleado.entity';
import { PagosEmpleadosService } from './pagos-empleados.service';
import { PagosEmpleadosController } from './pagos-empleados.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PagoEmpleado])],
  controllers: [PagosEmpleadosController],
  providers: [PagosEmpleadosService],
  exports: [PagosEmpleadosService],
})
export class PagosEmpleadosModule {}
