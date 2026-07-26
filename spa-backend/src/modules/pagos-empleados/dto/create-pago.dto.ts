import { IsInt, IsNumber, IsOptional, IsDateString, IsString, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePagoEmpleadoDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  id_empleado: number;

  @ApiProperty({ example: '2026-08-01' })
  @IsDateString()
  fecha_pago: string;

  @ApiProperty({ example: '2026-07-01' })
  @IsDateString()
  periodo_inicio: string;

  @ApiProperty({ example: '2026-07-31' })
  @IsDateString()
  periodo_fin: string;

  @ApiProperty({ example: 85000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto_bruto: number;

  @ApiPropertyOptional({ example: 12750 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  deducciones?: number;

  @ApiPropertyOptional({ example: 'transferencia' })
  @IsOptional()
  @IsString()
  metodo_pago?: string;

  @ApiPropertyOptional({ example: 'TRF-001' })
  @IsOptional()
  @IsString()
  referencia_pago?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas?: string;
}
