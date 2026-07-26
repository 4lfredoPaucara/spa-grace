import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { CreateLoteDto } from './dto/create-lote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Disponibilidad')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disponibilidad')
export class DisponibilidadController {
  constructor(private readonly service: DisponibilidadService) {}

  @Get()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Listar disponibilidad por empleado' })
  findAll(@Query('empleadoId', ParseIntPipe) empleadoId: number) {
    return this.service.findByEmpleado(empleadoId);
  }

  @Get(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Obtener disponibilidad por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear bloque de disponibilidad' })
  create(@Body() dto: CreateDisponibilidadDto) {
    return this.service.create(dto);
  }

  @Post('lote')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Configurar horarios semanales (lote)' })
  createLote(@Body() dto: CreateLoteDto) {
    return this.service.createLote(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar bloque de disponibilidad' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDisponibilidadDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar bloque de disponibilidad' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
