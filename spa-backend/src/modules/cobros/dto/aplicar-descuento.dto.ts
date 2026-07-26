import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AplicarDescuentoDto {
  @ApiProperty({ example: 'VERANO2026' })
  @IsString()
  codigo_descuento: string;
}
