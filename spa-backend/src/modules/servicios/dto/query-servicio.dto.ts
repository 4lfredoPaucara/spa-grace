import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TipoServicio } from '../../../common/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class QueryServicioDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TipoServicio })
  @IsOptional()
  @IsEnum(TipoServicio)
  tipo?: TipoServicio;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  categoriaId?: number;
}
