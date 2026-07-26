import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialClinico } from './entities/historial.entity';
import { HistorialesService } from './historiales.service';
import { HistorialesController } from './historiales.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialClinico])],
  controllers: [HistorialesController],
  providers: [HistorialesService],
  exports: [HistorialesService],
})
export class HistorialesModule {}
