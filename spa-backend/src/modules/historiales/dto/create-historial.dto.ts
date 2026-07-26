import { IsInt, IsString, IsOptional, IsDateString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHistorialDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_cliente: number;

  @ApiPropertyOptional({ example: 42 })
  @IsOptional()
  @IsInt()
  id_turno?: number;

  @ApiProperty({ example: '2026-08-10' })
  @IsDateString()
  fecha: string;

  @ApiPropertyOptional({ example: 'Contractura muscular cervical' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  diagnostico?: string;

  @ApiPropertyOptional({ example: 'Masaje semanal por 4 semanas' })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  tratamiento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notas?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  archivo_url?: string;
}
