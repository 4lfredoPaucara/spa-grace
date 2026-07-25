import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoWithUserDto } from './dto/create-empleado-with-user.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { QueryEmpleadoDto } from './dto/query-empleado.dto';
import { QueryDisponiblesDto } from './dto/query-disponibles.dto';
import { AssignServicioDto } from './dto/assign-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Empleados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly service: EmpleadosService) {}

  @Get()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Listar empleados con paginación' })
  findAll(@Query() query: QueryEmpleadoDto) {
    return this.service.findAll(query);
  }

  @Get('disponibles')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Buscar empleados disponibles por fecha y servicios' })
  findDisponibles(@Query() query: QueryDisponiblesDto) {
    return this.service.findDisponibles(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Obtener empleado por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Crear empleado con usuario (transacción atómica)' })
  create(@Body() dto: CreateEmpleadoWithUserDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar empleado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEmpleadoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar empleado (soft delete)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.softDelete(id);
  }

  @Post(':id/servicios')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Asignar servicio a empleado' })
  addServicio(@Param('id', ParseIntPipe) id: number, @Body() dto: AssignServicioDto) {
    return this.service.addServicio(id, dto.id_servicio);
  }

  @Delete(':id/servicios/:servicioId')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover servicio de empleado' })
  removeServicio(@Param('id', ParseIntPipe) id: number, @Param('servicioId', ParseIntPipe) servicioId: number) {
    return this.service.removeServicio(id, servicioId);
  }
}
