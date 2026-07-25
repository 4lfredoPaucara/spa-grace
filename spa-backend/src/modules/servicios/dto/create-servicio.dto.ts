import { IsString, IsOptional, IsBoolean, IsInt, IsNumber, IsEnum, Min, ValidateIf, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoServicio } from '../../../common/enums';

export class CreateServicioDto {
  @ApiProperty({ example: 'Masaje Descontracturante' })
  @IsString()
  @MinLength(2)
  nombre: string;

  @ApiPropertyOptional({ example: 'Masaje terapéutico de tejido profundo' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 60, description: 'Duración en minutos' })
  @IsInt()
  @Min(0)
  duracion: number;

  @ApiProperty({ example: 4500.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precio: number;

  @ApiProperty({ enum: TipoServicio, default: TipoServicio.PRINCIPAL })
  @IsEnum(TipoServicio)
  tipo: TipoServicio;

  @ApiPropertyOptional({ example: 1 })
  @ValidateIf((o) => o.tipo === TipoServicio.ADDON)
  @IsInt()
  parent_servicio_id?: number | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  id_categoria?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagen_url?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
