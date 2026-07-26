import {
  Injectable, NotFoundException, BadRequestException, ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Turno } from './entities/turno.entity';
import { Cobro } from '../cobros/entities/cobro.entity';
import { User } from '../users/entities/user.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { QueryTurnoDto } from './dto/query-turno.dto';
import { PaginatedResult } from '../../common/interfaces';
import { EstadoTurno, EstadoPago, Rol } from '../../common/enums';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
    @InjectRepository(Cobro)
    private readonly cobroRepository: Repository<Cobro>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: QueryTurnoDto): Promise<PaginatedResult<Turno>> {
    const { page = 1, limit = 10, estado, fecha, empleadoId, clienteId, search, sortBy = 'fecha', sortOrder = 'DESC' } = query;

    const qb = this.turnoRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.cliente', 'cliente')
      .leftJoinAndSelect('turno.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'empUsuario')
      .leftJoinAndSelect('turno.servicios', 'servicios')
      .leftJoinAndSelect('turno.cobro', 'cobro')
      .where('turno.deleted_at IS NULL');

    if (estado) {
      qb.andWhere('turno.estado = :estado', { estado });
    }

    if (fecha) {
      qb.andWhere('turno.fecha = :fecha', { fecha });
    }

    if (empleadoId) {
      qb.andWhere('turno.id_empleado = :empleadoId', { empleadoId });
    }

    if (clienteId) {
      qb.andWhere('turno.id_cliente = :clienteId', { clienteId });
    }

    if (search) {
      qb.andWhere('(cliente.nombre LIKE :search OR empUsuario.nombre LIKE :search)', { search: `%${search}%` });
    }

    const sortColumn = sortBy === 'fecha' ? ['turno.fecha', 'turno.hora'] : [`turno.${sortBy}`];
    qb.orderBy(sortColumn[0], sortOrder);

    if (sortBy === 'fecha') {
      qb.addOrderBy('turno.hora', sortOrder);
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Turno> {
    const turno = await this.turnoRepository.createQueryBuilder('turno')
      .leftJoinAndSelect('turno.cliente', 'cliente')
      .leftJoinAndSelect('turno.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'empUsuario')
      .leftJoinAndSelect('empleado.especialidad', 'especialidad')
      .leftJoinAndSelect('turno.servicios', 'servicios')
      .leftJoinAndSelect('turno.cobro', 'cobro')
      .where('turno.id = :id', { id })
      .andWhere('turno.deleted_at IS NULL')
      .getOne();

    if (!turno) throw new NotFoundException(`Turno con ID ${id} no encontrado`);
    return turno;
  }

  async create(dto: CreateTurnoDto): Promise<Turno> {
    const cliente = await this.userRepository.findOne({
      where: { id: dto.id_cliente, rol: Rol.CLIENTE, deleted_at: null as any },
    });
    if (!cliente) throw new BadRequestException('Cliente no encontrado o no tiene rol de cliente');

    const empleado = await this.empleadoRepository.findOne({
      where: { id: dto.id_empleado, activo: true, deleted_at: null as any },
      relations: { servicios: true },
    });
    if (!empleado) throw new BadRequestException('Empleado no encontrado o inactivo');

    const servicios = await this.servicioRepository.find({
      where: { id: In(dto.id_servicios), activo: true, deleted_at: null as any },
    });
    if (servicios.length !== dto.id_servicios.length) {
      throw new BadRequestException('Algunos servicios no existen o no están activos');
    }

    const empleadoServicioIds = empleado.servicios.map((s) => s.id);
    const noAutorizados = servicios.filter((s) => !empleadoServicioIds.includes(s.id));
    if (noAutorizados.length > 0) {
      throw new BadRequestException(`El empleado no está autorizado para: ${noAutorizados.map((s) => s.nombre).join(', ')}`);
    }

    await this.validarDisponibilidad(dto.id_empleado, dto.fecha, dto.hora, servicios);

    const duracionTotal = servicios.reduce((sum, s) => sum + s.duracion, 0);
    const precioTotal = servicios.reduce((sum, s) => sum + Number(s.precio), 0);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const turno = queryRunner.manager.create(Turno, {
        id_cliente: dto.id_cliente,
        id_empleado: dto.id_empleado,
        fecha: dto.fecha,
        hora: dto.hora,
        duracion_total: duracionTotal,
        precio_total: precioTotal,
        estado: EstadoTurno.PENDIENTE,
        notas_turno: dto.notas_turno || null,
      });
      const savedTurno = await queryRunner.manager.save(Turno, turno);

      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into('turnos_servicios')
        .values(servicios.map((s) => ({ id_turno: savedTurno.id, id_servicio: s.id, precio_servicio: s.precio })))
        .execute();

      const cobro = queryRunner.manager.create(Cobro, {
        id_turno: savedTurno.id,
        monto_total: precioTotal,
        monto_adelanto: 0,
        estado_pago: EstadoPago.PENDIENTE_ADELANTO,
      });
      await queryRunner.manager.save(Cobro, cobro);

      await queryRunner.commitTransaction();
      return this.findById(savedTurno.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findById(id);

    if (dto.estado) {
      this.validarTransicionEstado(turno.estado, dto.estado);
      turno.estado = dto.estado;
    }

    if (dto.notas_turno !== undefined) {
      turno.notas_turno = dto.notas_turno ?? null;
    }

    return this.turnoRepository.save(turno);
  }

  async softDelete(id: number): Promise<void> {
    const turno = await this.findById(id);
    await this.turnoRepository.softRemove(turno);
  }

  private async validarDisponibilidad(idEmpleado: number, fecha: string, hora: string, servicios: Servicio[]): Promise<void> {
    const diaSemanaMap: Record<number, string> = {
      0: 'domingo', 1: 'lunes', 2: 'martes', 3: 'miercoles',
      4: 'jueves', 5: 'viernes', 6: 'sabado',
    };
    const fechaObj = new Date(fecha + 'T12:00:00');
    const diaSemana = diaSemanaMap[fechaObj.getDay()];

    const duracionTotal = servicios.reduce((sum, s) => sum + s.duracion, 0);

    const disponibilidad = await this.dataSource.query(
      `SELECT * FROM disponibilidad_empleados
       WHERE id_empleado = ?
         AND dia_semana = ?
         AND activo = 1
         AND hora_inicio <= ?
         AND hora_fin >= ADDTIME(?, SEC_TO_TIME(? * 60))`,
      [idEmpleado, diaSemana, hora, hora, duracionTotal],
    );

    if (disponibilidad.length === 0) {
      throw new BadRequestException(`El empleado no tiene disponibilidad el ${diaSemana} de ${hora} a ${this.calcularHoraFin(hora, duracionTotal)}`);
    }

    const conflicto = await this.dataSource.query(
      `SELECT COUNT(*) as conflictos FROM turnos
       WHERE id_empleado = ?
         AND fecha = ?
         AND deleted_at IS NULL
         AND estado IN ('pendiente', 'confirmado')
         AND hora < ADDTIME(?, SEC_TO_TIME(? * 60))
         AND ADDTIME(hora, SEC_TO_TIME(duracion_total * 60)) > ?`,
      [idEmpleado, fecha, hora, duracionTotal, hora],
    );

    if (conflicto[0].conflictos > 0) {
      throw new ConflictException('El empleado ya tiene un turno que se solapa con este horario');
    }
  }

  private validarTransicionEstado(actual: EstadoTurno, nuevo: EstadoTurno): void {
    const permitidas: Record<EstadoTurno, EstadoTurno[]> = {
      [EstadoTurno.PENDIENTE]: [EstadoTurno.CONFIRMADO, EstadoTurno.CANCELADO],
      [EstadoTurno.CONFIRMADO]: [EstadoTurno.ATENDIDO, EstadoTurno.AUSENTE, EstadoTurno.CANCELADO, EstadoTurno.REPROGRAMADO],
      [EstadoTurno.ATENDIDO]: [],
      [EstadoTurno.CANCELADO]: [EstadoTurno.REPROGRAMADO],
      [EstadoTurno.AUSENTE]: [EstadoTurno.REPROGRAMADO],
      [EstadoTurno.REPROGRAMADO]: [EstadoTurno.PENDIENTE, EstadoTurno.CONFIRMADO],
    };

    if (!permitidas[actual]?.includes(nuevo)) {
      throw new BadRequestException(`No se puede cambiar de "${actual}" a "${nuevo}"`);
    }
  }

  private calcularHoraFin(hora: string, duracionMinutos: number): string {
    const [h, m] = hora.split(':').map(Number);
    const totalMinutos = h * 60 + m + duracionMinutos;
    const hh = Math.floor(totalMinutos / 60) % 24;
    const mm = totalMinutos % 60;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
}
