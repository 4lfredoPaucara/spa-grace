import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, ParseIntPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PagosEmpleadosService } from './pagos-empleados.service';
import { CreatePagoEmpleadoDto } from './dto/create-pago.dto';
import { UpdatePagoEmpleadoDto } from './dto/update-pago.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Pagos Empleados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('pagos-empleados')
export class PagosEmpleadosController {
  constructor(private readonly service: PagosEmpleadosService) {}

  @Get()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Listar pagos de empleados' })
  findAll(@Query() query: PaginationDto & { empleadoId?: number }) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Obtener pago por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post()
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Registrar pago de nómina' })
  create(@Body() dto: CreatePagoEmpleadoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles(Rol.ADMIN)
  @ApiOperation({ summary: 'Actualizar pago' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePagoEmpleadoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Rol.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar pago' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
