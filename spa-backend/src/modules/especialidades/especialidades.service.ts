import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from './entities/especialidad.entity';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly repository: Repository<Especialidad>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<Especialidad>> {
    const { page = 1, limit = 10, search, sortBy = 'nombre', sortOrder = 'ASC' } = query;

    const qb = this.repository.createQueryBuilder('e');

    if (search) {
      qb.where('e.nombre LIKE :search OR e.descripcion LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`e.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number): Promise<Especialidad> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    return entity;
  }

  async create(dto: CreateEspecialidadDto): Promise<Especialidad> {
    const exists = await this.repository.findOneBy({ nombre: dto.nombre });
    if (exists) throw new ConflictException(`La especialidad "${dto.nombre}" ya existe`);
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateEspecialidadDto): Promise<Especialidad> {
    const entity = await this.findById(id);
    if (dto.nombre && dto.nombre !== entity.nombre) {
      const exists = await this.repository.findOneBy({ nombre: dto.nombre });
      if (exists) throw new ConflictException(`La especialidad "${dto.nombre}" ya existe`);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }
}
