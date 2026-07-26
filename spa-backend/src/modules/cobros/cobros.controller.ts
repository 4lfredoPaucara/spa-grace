import {
  Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CobrosService } from './cobros.service';
import { RegistrarAdelantoDto } from './dto/registrar-adelanto.dto';
import { RegistrarPagoFinalDto } from './dto/registrar-pago.dto';
import { AplicarDescuentoDto } from './dto/aplicar-descuento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Rol } from '../../common/enums';

@ApiTags('Cobros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cobros')
export class CobrosController {
  constructor(private readonly service: CobrosService) {}

  @Get()
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Listar cobros' })
  findAll(@Query() query: PaginationDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Obtener cobro por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Post(':id/registrar-adelanto')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Registrar adelanto de pago' })
  registrarAdelanto(@Param('id', ParseIntPipe) id: number, @Body() dto: RegistrarAdelantoDto) {
    return this.service.registrarAdelanto(id, dto);
  }

  @Post(':id/registrar-pago-final')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Registrar pago final' })
  registrarPagoFinal(@Param('id', ParseIntPipe) id: number, @Body() dto: RegistrarPagoFinalDto) {
    return this.service.registrarPagoFinal(id, dto);
  }

  @Post(':id/aplicar-descuento')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Aplicar código de descuento' })
  aplicarDescuento(@Param('id', ParseIntPipe) id: number, @Body() dto: AplicarDescuentoDto) {
    return this.service.aplicarDescuento(id, dto);
  }

  @Post(':id/reembolsar')
  @Roles(Rol.ADMIN, Rol.RECEPCIONISTA)
  @ApiOperation({ summary: 'Reembolsar adelanto' })
  reembolsar(@Param('id', ParseIntPipe) id: number) {
    return this.service.reembolsar(id);
  }
}
