import { IsArray, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDisponibilidadDto } from './create-disponibilidad.dto';

class HorarioItem {
  @ApiProperty({ enum: ['lunes','martes','miercoles','jueves','viernes','sabado','domingo'] })
  dia_semana: string;

  @ApiProperty({ example: '09:00' })
  hora_inicio: string;

  @ApiProperty({ example: '18:00' })
  hora_fin: string;
}

export class CreateLoteDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  id_empleado: number;

  @ApiProperty({ type: [HorarioItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioItem as any)
  horarios: { dia_semana: string; hora_inicio: string; hora_fin: string }[];
}
