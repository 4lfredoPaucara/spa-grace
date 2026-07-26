import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cobro } from './entities/cobro.entity';
import { Turno } from '../turnos/entities/turno.entity';
import { Promocion } from '../promociones/entities/promocion.entity';
import { RegistrarAdelantoDto } from './dto/registrar-adelanto.dto';
import { RegistrarPagoFinalDto } from './dto/registrar-pago.dto';
import { AplicarDescuentoDto } from './dto/aplicar-descuento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';
import { EstadoTurno, EstadoPago, TipoDescuento, AlcancePromocion } from '../../common/enums';

@Injectable()
export class CobrosService {
  constructor(
    @InjectRepository(Cobro)
    private readonly cobroRepository: Repository<Cobro>,
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(Promocion)
    private readonly promocionRepository: Repository<Promocion>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<Cobro>> {
    const { page = 1, limit = 10, search } = query;

    const qb = this.cobroRepository.createQueryBuilder('cobro')
      .leftJoinAndSelect('cobro.turno', 'turno')
      .leftJoinAndSelect('turno.cliente', 'cliente');

    if (search) {
      qb.andWhere('(cliente.nombre LIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy('cobro.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Cobro> {
    const cobro = await this.cobroRepository.findOne({
      where: { id },
      relations: { turno: { cliente: true, empleado: { usuario: true }, servicios: true } },
    });

    if (!cobro) throw new NotFoundException(`Cobro con ID ${id} no encontrado`);
    return cobro;
  }

  async registrarAdelanto(id: number, dto: RegistrarAdelantoDto): Promise<Cobro> {
    const cobro = await this.findById(id);

    if (cobro.estado_pago !== EstadoPago.PENDIENTE_ADELANTO) {
      throw new BadRequestException('Solo se puede registrar adelanto en estado pendiente_adelanto');
    }

    if (dto.monto_adelanto <= 0) {
      throw new BadRequestException('El monto del adelanto debe ser mayor a 0');
    }

    if (dto.monto_adelanto > Number(cobro.monto_total)) {
      throw new BadRequestException('El adelanto no puede superar el monto total');
    }

    cobro.monto_adelanto = dto.monto_adelanto;
    cobro.metodo_pago_adelanto = dto.metodo_pago_adelanto || null;
    cobro.fecha_adelanto = new Date();
    cobro.estado_pago = Number(cobro.monto_total) === Number(dto.monto_adelanto)
      ? EstadoPago.PAGADO_COMPLETO
      : EstadoPago.ADELANTO_PAGADO;
    cobro.notas = dto.notas ? `${cobro.notas || ''}\nAdelanto: ${dto.notas}`.trim() : cobro.notas;

    return this.cobroRepository.save(cobro);
  }

  async registrarPagoFinal(id: number, dto: RegistrarPagoFinalDto): Promise<Cobro> {
    const cobro = await this.findById(id);

    if (cobro.estado_pago !== EstadoPago.ADELANTO_PAGADO) {
      throw new BadRequestException('Solo se puede registrar pago final después de un adelanto');
    }

    const turno = await this.turnoRepository.findOne({ where: { id: cobro.id_turno } });
    if (turno && turno.estado !== EstadoTurno.ATENDIDO && turno.estado !== EstadoTurno.CONFIRMADO) {
      throw new BadRequestException('El turno debe estar confirmado o atendido para el pago final');
    }

    cobro.monto_adelanto = cobro.monto_total;
    cobro.metodo_pago_final = dto.metodo_pago_final || null;
    cobro.fecha_cobro_final = new Date();
    cobro.estado_pago = EstadoPago.PAGADO_COMPLETO;
    cobro.notas = dto.notas ? `${cobro.notas || ''}\nPago final: ${dto.notas}`.trim() : cobro.notas;

    return this.cobroRepository.save(cobro);
  }

  async aplicarDescuento(id: number, dto: AplicarDescuentoDto): Promise<Cobro> {
    const cobro = await this.findById(id);

    if ([EstadoPago.PAGADO_COMPLETO, EstadoPago.REEMBOLSADO].includes(cobro.estado_pago)) {
      throw new BadRequestException('No se puede aplicar descuento en el estado actual del cobro');
    }

    const promocion = await this.promocionRepository.findOne({
      where: { codigo_descuento: dto.codigo_descuento, activo: true },
      relations: { servicioAplicable: true },
    });

    if (!promocion) throw new BadRequestException('Código de descuento inválido');

    const hoy = new Date().toISOString().split('T')[0];
    if (promocion.fecha_inicio && promocion.fecha_inicio > hoy) {
      throw new BadRequestException('La promoción aún no está vigente');
    }
    if (promocion.fecha_fin && promocion.fecha_fin < hoy) {
      throw new BadRequestException('La promoción ha expirado');
    }

    if (promocion.aplica_a === AlcancePromocion.SERVICIO_ESPECIFICO && promocion.servicioAplicable) {
      const turno = await this.turnoRepository.findOne({
        where: { id: cobro.id_turno },
        relations: { servicios: true },
      });
      const tieneServicio = turno?.servicios.some((s) => s.id === promocion.servicioAplicable?.id);
      if (!tieneServicio) throw new BadRequestException('Esta promoción no aplica a los servicios del turno');
    }

    const montoOriginal = Number(cobro.monto_total);
    let descuento = 0;

    if (promocion.tipo_descuento === TipoDescuento.PORCENTAJE) {
      descuento = montoOriginal * (Number(promocion.valor_descuento) / 100);
    } else if (promocion.tipo_descuento === TipoDescuento.FIJO) {
      descuento = Number(promocion.valor_descuento);
    }

    cobro.monto_total = montoOriginal - descuento;
    cobro.promocion_aplicada = dto.codigo_descuento;
    cobro.notas = `${cobro.notas || ''}\nDescuento: ${dto.codigo_descuento} (-$${descuento.toFixed(2)})`.trim();

    return this.cobroRepository.save(cobro);
  }

  async reembolsar(id: number): Promise<Cobro> {
    const cobro = await this.findById(id);

    if (cobro.estado_pago !== EstadoPago.ADELANTO_PAGADO) {
      throw new BadRequestException('Solo se puede reembolsar un adelanto pagado');
    }

    const turno = await this.turnoRepository.findOne({ where: { id: cobro.id_turno } });
    if (turno && turno.estado !== EstadoTurno.CANCELADO && turno.estado !== EstadoTurno.AUSENTE) {
      throw new BadRequestException('El turno debe estar cancelado o ausente para reembolsar');
    }

    if (Number(cobro.monto_adelanto) <= 0) {
      throw new BadRequestException('No hay adelanto para reembolsar');
    }

    const montoReembolsado = cobro.monto_adelanto;
    cobro.monto_adelanto = 0;
    cobro.estado_pago = EstadoPago.REEMBOLSADO;
    cobro.fecha_cobro_final = new Date();
    cobro.notas = `${cobro.notas || ''}\nReembolso: $${Number(montoReembolsado).toFixed(2)}`.trim();

    return this.cobroRepository.save(cobro);
  }
}
