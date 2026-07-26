import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus, Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Promociones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promociones')
export class PromocionesController {
  constructor(private readonly service: PromocionesService) {}

  @Get()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar promociones' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get('validar')
  @Public()
  @ApiOperation({ summary: 'Validar código de descuento' })
  validar(@Query('codigo') codigo: string, @Query('servicioId') servicioId?: number) {
    return this.service.validarCodigo(codigo, servicioId);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener promoción por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear promoción' })
  create(@Body() dto: CreatePromocionDto, @Req() req: any) {
    return this.service.create(dto, req.user.id);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar promoción' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePromocionDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar promoción (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }

  @Post(':id/activar')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Activar promoción' })
  activar(@Param('id', ParseIntPipe) id: number) {
    return this.service.activar(id);
  }

  @Post(':id/desactivar')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Desactivar promoción' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.service.desactivar(id);
  }
}
