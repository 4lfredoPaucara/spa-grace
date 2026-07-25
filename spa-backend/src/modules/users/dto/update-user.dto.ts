import { IsOptional, IsString, IsEmail, IsEnum, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Rol, Sexo } from '../../../common/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;

  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;
}
