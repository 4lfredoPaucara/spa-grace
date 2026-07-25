import { IsOptional, IsBoolean, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmpleadoDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  id_especialidad?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
