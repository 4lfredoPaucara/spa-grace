import { IsArray, IsInt, IsString, IsOptional, IsDateString, Matches, ArrayMinSize, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTurnoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_cliente: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  id_empleado: number;

  @ApiProperty({ example: [1, 8] })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  id_servicios: number[];

  @ApiProperty({ example: '2026-08-10' })
  @IsDateString()
  fecha: string;

  @ApiProperty({ example: '15:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'hora debe tener formato HH:MM' })
  hora: string;

  @ApiPropertyOptional({ example: 'Cliente prefiere presión media' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas_turno?: string;
}
