import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignServicioDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id_servicio: number;
}
