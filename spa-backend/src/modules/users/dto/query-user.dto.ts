import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Rol } from '../../../common/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryUserDto extends PaginationDto {
  @ApiPropertyOptional({ enum: Rol })
  @IsOptional()
  @IsEnum(Rol)
  rol?: Rol;
}
