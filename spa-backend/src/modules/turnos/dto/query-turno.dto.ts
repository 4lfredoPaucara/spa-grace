import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoTurno } from '../../../common/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryTurnoDto extends PaginationDto {
  @ApiPropertyOptional({ enum: EstadoTurno })
  @IsOptional()
  @IsEnum(EstadoTurno)
  estado?: EstadoTurno;

  @ApiPropertyOptional({ example: '2026-08-10' })
  @IsOptional()
  @IsString()
  fecha?: string;

  @ApiPropertyOptional()
  @IsOptional()
  empleadoId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  clienteId?: number;
}
