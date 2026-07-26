import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTurno } from '../../../common/enums';

export class UpdateTurnoDto {
  @ApiPropertyOptional({ enum: EstadoTurno })
  @IsOptional()
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas_turno?: string;
}
