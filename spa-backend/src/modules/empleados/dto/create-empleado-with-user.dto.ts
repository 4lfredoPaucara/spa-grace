import { IsString, IsEmail, IsOptional, IsEnum, MinLength, IsBoolean, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rol } from '../../../common/enums';

export class CreateEmpleadoUserDto {
  @ApiProperty({ example: 'Ana Gómez' })
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'ana@spagrace.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'anagomez' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiPropertyOptional({ enum: Rol, default: Rol.TERAPEUTA })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @IsString()
  telefono?: string;
}

export class CreateEmpleadoWithUserDto {
  @ApiProperty({ type: CreateEmpleadoUserDto })
  @ValidateNested()
  @Type(() => CreateEmpleadoUserDto)
  usuario: CreateEmpleadoUserDto;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  id_especialidad?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: [1, 2, 5], type: [Number] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  serviciosIds?: number[];
}
