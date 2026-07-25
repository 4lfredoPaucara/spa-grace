import {
  Injectable, NotFoundException, ConflictException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Empleado } from './entities/empleado.entity';
import { User } from '../users/entities/user.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { Especialidad } from '../especialidades/entities/especialidad.entity';
import { CreateEmpleadoWithUserDto } from './dto/create-empleado-with-user.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { QueryEmpleadoDto } from './dto/query-empleado.dto';
import { QueryDisponiblesDto } from './dto/query-disponibles.dto';
import { PaginatedResult } from '../../common/interfaces';
import { Rol } from '../../common/enums';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: QueryEmpleadoDto): Promise<PaginatedResult<Empleado>> {
    const { page = 1, limit = 10, search, activo, sortBy = 'created_at', sortOrder = 'DESC' } = query;

    const qb = this.empleadoRepository.createQueryBuilder('empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      .leftJoinAndSelect('empleado.especialidad', 'especialidad')
      .leftJoinAndSelect('empleado.servicios', 'servicios')
      .where('empleado.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(usuario.nombre LIKE :search OR usuario.email LIKE :search)', { search: `%${search}%` });
    }

    if (activo !== undefined) {
      qb.andWhere('empleado.activo = :activo', { activo });
    }

    qb.orderBy(`empleado.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Empleado> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id, deleted_at: null as any },
      relations: { usuario: true, especialidad: true, servicios: true },
    });

    if (!empleado) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    return empleado;
  }

  async create(dto: CreateEmpleadoWithUserDto): Promise<Empleado> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingEmail = await queryRunner.manager.findOne(User, {
        where: { email: dto.usuario.email, deleted_at: null as any },
      });
      if (existingEmail) throw new ConflictException('El email ya está en uso');

      if (dto.usuario.username) {
        const existingUsername = await queryRunner.manager.findOne(User, {
          where: { username: dto.usuario.username, deleted_at: null as any },
        });
        if (existingUsername) throw new ConflictException('El username ya está en uso');
      }

      if (dto.id_especialidad) {
        const esp = await queryRunner.manager.findOne(Especialidad, { where: { id: dto.id_especialidad } });
        if (!esp) throw new BadRequestException('La especialidad no existe');
      }

      const user = queryRunner.manager.create(User, {
        nombre: dto.usuario.nombre,
        email: dto.usuario.email,
        username: dto.usuario.username,
        password: await bcrypt.hash(dto.usuario.password, BCRYPT_SALT_ROUNDS),
        rol: dto.usuario.rol || Rol.TERAPEUTA,
        telefono: dto.usuario.telefono || null,
      });
      const savedUser = await queryRunner.manager.save(User, user);

      const empleado = queryRunner.manager.create(Empleado, {
        id_usuario: savedUser.id,
        id_especialidad: dto.id_especialidad || null,
        activo: dto.activo !== false,
      });
      const savedEmpleado = await queryRunner.manager.save(Empleado, empleado);

      if (dto.serviciosIds && dto.serviciosIds.length > 0) {
        const servicios = await queryRunner.manager.find(Servicio, {
          where: { id: In(dto.serviciosIds), activo: true, deleted_at: null as any },
        });

        if (servicios.length !== dto.serviciosIds.length) {
          throw new BadRequestException('Algunos servicios no existen o no están activos');
        }

        await queryRunner.manager
          .createQueryBuilder()
          .insert()
          .into('empleados_servicios')
          .values(dto.serviciosIds.map((idServicio) => ({ id_empleado: savedEmpleado.id, id_servicio: idServicio })))
          .execute();
      }

      await queryRunner.commitTransaction();

      return this.findById(savedEmpleado.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateEmpleadoDto): Promise<Empleado> {
    const empleado = await this.findById(id);

    if (dto.id_especialidad) {
      const esp = await this.especialidadRepository.findOneBy({ id: dto.id_especialidad });
      if (!esp) throw new BadRequestException('La especialidad no existe');
    }

    Object.assign(empleado, dto);
    return this.empleadoRepository.save(empleado);
  }

  async softDelete(id: number): Promise<void> {
    const empleado = await this.findById(id);
    await this.empleadoRepository.softRemove(empleado);
  }

  async addServicio(id: number, idServicio: number): Promise<Empleado> {
    const empleado = await this.findById(id);

    const servicio = await this.servicioRepository.findOne({
      where: { id: idServicio, activo: true, deleted_at: null as any },
    });
    if (!servicio) throw new BadRequestException('El servicio no existe o no está activo');

    await this.empleadoRepository
      .createQueryBuilder()
      .relation(Empleado, 'servicios')
      .of(empleado)
      .add(servicio);

    return this.findById(id);
  }

  async removeServicio(id: number, idServicio: number): Promise<Empleado> {
    const empleado = await this.findById(id);

    await this.empleadoRepository
      .createQueryBuilder()
      .relation(Empleado, 'servicios')
      .of(empleado)
      .remove(idServicio);

    return this.findById(id);
  }

  async findDisponibles(query: QueryDisponiblesDto): Promise<any[]> {
    const qb = this.empleadoRepository.createQueryBuilder('empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario')
      .leftJoinAndSelect('empleado.especialidad', 'especialidad')
      .leftJoinAndSelect('empleado.servicios', 'servicios')
      .where('empleado.deleted_at IS NULL')
      .andWhere('empleado.activo = 1');

    if (query.servicioIds) {
      const ids = query.servicioIds.split(',').map(Number).filter((n) => !isNaN(n));
      if (ids.length > 0) {
        qb.andWhere((qb2) => {
          const subQuery = qb2
            .subQuery()
            .select('es.id_empleado')
            .from('empleados_servicios', 'es')
            .where('es.id_servicio IN (:...servicioIds)', { servicioIds: ids })
            .groupBy('es.id_empleado')
            .having('COUNT(DISTINCT es.id_servicio) = :count', { count: ids.length })
            .getQuery();
          return 'empleado.id IN ' + subQuery;
        });
      }
    }

    const empleados = await qb.getMany();

    const result = empleados.map((emp) => ({
      id: emp.id,
      usuario: { nombre: emp.usuario?.nombre },
      especialidad: emp.especialidad,
      servicios: emp.servicios,
      disponible: true,
      sinConflictos: true,
      serviciosCompatibles: emp.servicios?.map((s) => s.id) || [],
    }));

    return result;
  }
}
