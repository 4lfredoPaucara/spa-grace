import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { QueryServicioDto } from './dto/query-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Servicios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('servicios')
export class ServiciosController {
  constructor(private readonly service: ServiciosService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar servicios con filtros y paginación' })
  findAll(@Query() query: QueryServicioDto) {
    return this.service.findAll(query);
  }

  @Get('principales')
  @Public()
  @ApiOperation({ summary: 'Listar servicios principales activos' })
  findPrincipales() {
    return this.service.findPrincipales();
  }

  @Get('addons/:parentId')
  @Public()
  @ApiOperation({ summary: 'Listar add-ons de un servicio principal' })
  findAddons(@Param('parentId', ParseIntPipe) parentId: number) {
    return this.service.findAddons(parentId);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener servicio por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear servicio' })
  create(@Body() dto: CreateServicioDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar servicio' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateServicioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar servicio (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }
}
