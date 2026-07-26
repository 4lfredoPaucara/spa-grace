import { IsOptional, IsNumber, IsString, IsEnum, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetodoPago } from '../../../common/enums';

export class RegistrarAdelantoDto {
  @ApiProperty({ example: 2000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto_adelanto: number;

  @ApiPropertyOptional({ enum: MetodoPago, example: 'transferencia' })
  @IsOptional()
  @IsString()
  metodo_pago_adelanto?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notas?: string;
}
