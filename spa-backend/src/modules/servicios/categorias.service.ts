import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { CreateCategoriaServicioDto } from './dto/create-categoria.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(CategoriaServicio)
    private readonly repository: Repository<CategoriaServicio>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<CategoriaServicio>> {
    const { page = 1, limit = 50, search, sortBy = 'orden', sortOrder = 'ASC' } = query;

    const qb = this.repository.createQueryBuilder('c');

    if (search) {
      qb.where('c.nombre LIKE :search OR c.descripcion LIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`c.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<CategoriaServicio> {
    const entity = await this.repository.findOneBy({ id });
    if (!entity) throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    return entity;
  }

  async create(dto: CreateCategoriaServicioDto): Promise<CategoriaServicio> {
    const exists = await this.repository.findOneBy({ nombre: dto.nombre });
    if (exists) throw new ConflictException(`La categoría "${dto.nombre}" ya existe`);
    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateCategoriaServicioDto): Promise<CategoriaServicio> {
    const entity = await this.findById(id);
    if (dto.nombre && dto.nombre !== entity.nombre) {
      const exists = await this.repository.findOneBy({ nombre: dto.nombre });
      if (exists) throw new ConflictException(`La categoría "${dto.nombre}" ya existe`);
    }
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }
}
