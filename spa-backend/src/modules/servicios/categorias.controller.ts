import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaServicioDto } from './dto/create-categoria.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Categorías de Servicios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categorias-servicios')
export class CategoriasController {
  constructor(private readonly service: CategoriasService) {}

  @Get()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Listar categorías' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear categoría' })
  create(@Body() dto: CreateCategoriaServicioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar categoría' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoriaServicioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar categoría' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
