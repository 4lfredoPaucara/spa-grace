import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryDisponiblesDto {
  @ApiPropertyOptional({ example: '2026-08-10' })
  @IsOptional()
  @IsString()
  fecha?: string;

  @ApiPropertyOptional({ example: '15:00' })
  @IsOptional()
  @IsString()
  hora?: string;

  @ApiPropertyOptional({ example: '1,2', description: 'IDs de servicios separados por coma' })
  @IsOptional()
  @IsString()
  servicioIds?: string;
}
