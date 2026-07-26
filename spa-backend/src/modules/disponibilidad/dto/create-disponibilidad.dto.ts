import { IsEnum, IsString, IsOptional, IsBoolean, Matches, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DiaSemana } from '../../../common/enums';

export class CreateDisponibilidadDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  id_empleado: number;

  @ApiProperty({ enum: DiaSemana, example: 'lunes' })
  @IsEnum(DiaSemana)
  dia_semana: DiaSemana;

  @ApiProperty({ example: '09:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  hora_inicio: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  hora_fin: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
