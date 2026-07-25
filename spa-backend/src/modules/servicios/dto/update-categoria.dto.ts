import { PartialType } from '@nestjs/swagger';
import { CreateCategoriaServicioDto } from './create-categoria.dto';

export class UpdateCategoriaServicioDto extends PartialType(CreateCategoriaServicioDto) {}
