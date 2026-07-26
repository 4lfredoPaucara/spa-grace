import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistorialesService } from './historiales.service';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Historiales Clínicos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('historiales')
export class HistorialesController {
  constructor(private readonly service: HistorialesService) {}

  @Get()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Listar historiales con paginación' })
  findAll(@Query() query: PaginationDto & { clienteId?: number }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Obtener historial por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Crear registro clínico' })
  create(@Body() dto: CreateHistorialDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Actualizar registro clínico' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHistorialDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar registro (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }
}
