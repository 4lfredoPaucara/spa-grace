import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  IsPhoneNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Rol, Sexo } from '../../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mariagarcia', required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Rol, default: Rol.CLIENTE })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  fecha_nacimiento?: string;

  @ApiPropertyOptional({ enum: Sexo })
  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar_url?: string;
}
