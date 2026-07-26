import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean, Min, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoDescuento, AlcancePromocion } from '../../../common/enums';

export class CreatePromocionDto {
  @ApiProperty({ example: 'Verano 2026 - 20% OFF en Masajes' })
  @IsString()
  titulo: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagen_url?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  fecha_inicio?: string;

  @ApiPropertyOptional({ example: '2026-02-28' })
  @IsOptional()
  @IsDateString()
  fecha_fin?: string;

  @ApiProperty({ example: 'VERANO2026' })
  @IsString()
  codigo_descuento: string;

  @ApiPropertyOptional({ enum: TipoDescuento })
  @IsOptional()
  @IsEnum(TipoDescuento)
  tipo_descuento?: TipoDescuento;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  valor_descuento?: number;

  @ApiPropertyOptional({ enum: AlcancePromocion, default: 'todos' })
  @IsOptional()
  @IsEnum(AlcancePromocion)
  aplica_a?: AlcancePromocion;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_servicio_aplicable?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  id_categoria_aplicable?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
