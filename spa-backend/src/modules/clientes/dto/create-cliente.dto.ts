import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({ example: 'Laura Martínez' })
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'laura@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: 'Av. Corrientes 1234, CABA' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: 'Docente' })
  @IsOptional()
  @IsString()
  ocupacion?: string;

  @ApiPropertyOptional({ example: 'instagram' })
  @IsOptional()
  @IsString()
  como_conocio?: string;

  @ApiPropertyOptional({ example: 'Ninguna conocida' })
  @IsOptional()
  @IsString()
  alergias?: string;

  @ApiPropertyOptional({ example: 'Cliente VIP - Prefiere turnos matutinos' })
  @IsOptional()
  @IsString()
  notas_internas?: string;
}
