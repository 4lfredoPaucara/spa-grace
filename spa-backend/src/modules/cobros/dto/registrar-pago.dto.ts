import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarPagoFinalDto {
  @ApiPropertyOptional({ example: 'efectivo' })
  @IsOptional()
  @IsString()
  metodo_pago_final?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas?: string;
}
