import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Promocion } from '../promociones/entities/promocion.entity';
import { CobrosService } from './cobros.service';
import { CobrosController } from './cobros.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cobro, Turno, Promocion])],
  controllers: [CobrosController],
  providers: [CobrosService],
  exports: [CobrosService],
})
export class CobrosModule {}
