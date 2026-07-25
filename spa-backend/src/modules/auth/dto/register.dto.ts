import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'María García' })
  @IsString()
  @MinLength(3)
  nombre: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'mariagarcia' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '+5491123456789' })
  @IsOptional()
  @IsString()
  telefono?: string;
}
