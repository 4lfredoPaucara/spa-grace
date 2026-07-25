import {
  Controller, Get, Post, Patch,
  Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clientes')
export class ClientesController {
  constructor(private readonly service: ClientesService) {}

  @Get()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar clientes con búsqueda' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get(':id/historial')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA, Rol.TERAPEUTA)
  @ApiOperation({ summary: 'Obtener historial clínico del cliente' })
  getHistorial(@Param('id', ParseIntPipe) id: number, @Query() query: PaginationDto) {
    return this.service.getHistorial(id, query);
  }

  @Post()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Crear cliente' })
  create(@Body() dto: CreateClienteDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Actualizar cliente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClienteDto) {
    return this.service.update(id, dto);
  }
}
