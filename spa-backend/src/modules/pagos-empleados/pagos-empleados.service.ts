import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagoEmpleado } from './entities/pago-empleado.entity';
import { CreatePagoEmpleadoDto } from './dto/create-pago.dto';
import { UpdatePagoEmpleadoDto } from './dto/update-pago.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class PagosEmpleadosService {
  constructor(
    @InjectRepository(PagoEmpleado)
    private readonly repository: Repository<PagoEmpleado>,
  ) {}

  async findAll(query: PaginationDto & { empleadoId?: number }): Promise<PaginatedResult<PagoEmpleado>> {
    const { page = 1, limit = 10, empleadoId, search } = query;

    const qb = this.repository.createQueryBuilder('pago')
      .leftJoinAndSelect('pago.empleado', 'empleado')
      .leftJoinAndSelect('empleado.usuario', 'usuario');

    if (empleadoId) {
      qb.andWhere('pago.id_empleado = :empleadoId', { empleadoId });
    }

    qb.orderBy('pago.fecha_pago', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<PagoEmpleado> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: { empleado: { usuario: true } },
    });
    if (!entity) throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    return entity;
  }

  async create(dto: CreatePagoEmpleadoDto): Promise<PagoEmpleado> {
    return this.repository.save(this.repository.create({
      ...dto,
      deducciones: dto.deducciones || 0,
    }));
  }

  async update(id: number, dto: UpdatePagoEmpleadoDto): Promise<PagoEmpleado> {
    const entity = await this.findById(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }
}
