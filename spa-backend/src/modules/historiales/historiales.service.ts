import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistorialClinico } from './entities/historial.entity';
import { CreateHistorialDto } from './dto/create-historial.dto';
import { UpdateHistorialDto } from './dto/update-historial.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class HistorialesService {
  constructor(
    @InjectRepository(HistorialClinico)
    private readonly repository: Repository<HistorialClinico>,
  ) {}

  async findAll(query: PaginationDto & { clienteId?: number }): Promise<PaginatedResult<HistorialClinico>> {
    const { page = 1, limit = 10, clienteId, search } = query;

    const qb = this.repository.createQueryBuilder('historial')
      .leftJoinAndSelect('historial.cliente', 'cliente')
      .leftJoinAndSelect('historial.turno', 'turno')
      .where('historial.deleted_at IS NULL');

    if (clienteId) {
      qb.andWhere('historial.id_cliente = :clienteId', { clienteId });
    }

    if (search) {
      qb.andWhere('(historial.diagnostico LIKE :search OR historial.tratamiento LIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy('historial.fecha', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<HistorialClinico> {
    const entity = await this.repository.findOne({
      where: { id, deleted_at: null as any },
      relations: { cliente: true, turno: true },
    });
    if (!entity) throw new NotFoundException(`Historial con ID ${id} no encontrado`);
    return entity;
  }

  async create(dto: CreateHistorialDto): Promise<HistorialClinico> {
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateHistorialDto): Promise<HistorialClinico> {
    const entity = await this.findById(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.softRemove(entity);
  }
}
