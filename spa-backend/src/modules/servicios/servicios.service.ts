import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { QueryServicioDto } from './dto/query-servicio.dto';
import { TipoServicio } from '../../common/enums';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class ServiciosService {
  constructor(
    @InjectRepository(Servicio)
    private readonly repository: Repository<Servicio>,
    @InjectRepository(CategoriaServicio)
    private readonly categoriaRepository: Repository<CategoriaServicio>,
  ) {}

  async findAll(query: QueryServicioDto): Promise<PaginatedResult<Servicio>> {
    const { page = 1, limit = 10, search, tipo, activo, categoriaId, sortBy = 'nombre', sortOrder = 'ASC' } = query;

    const qb = this.repository.createQueryBuilder('s')
      .leftJoinAndSelect('s.categoria', 'categoria')
      .leftJoinAndSelect('s.parentServicio', 'parent')
      .where('s.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(s.nombre LIKE :search OR s.descripcion LIKE :search)', { search: `%${search}%` });
    }

    if (tipo) {
      qb.andWhere('s.tipo = :tipo', { tipo });
    }

    if (activo !== undefined) {
      qb.andWhere('s.activo = :activo', { activo });
    }

    if (categoriaId) {
      qb.andWhere('s.id_categoria = :categoriaId', { categoriaId });
    }

    qb.orderBy(`s.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Servicio> {
    const entity = await this.repository.findOne({
      where: { id, deleted_at: null as any },
      relations: { categoria: true, parentServicio: true, addons: true },
    });

    if (!entity) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    return entity;
  }

  async findPrincipales(): Promise<Servicio[]> {
    return this.repository.find({
      where: { tipo: TipoServicio.PRINCIPAL, activo: true, deleted_at: null as any },
      relations: { categoria: true },
      order: { nombre: 'ASC' },
    });
  }

  async findAddons(parentId: number): Promise<Servicio[]> {
    return this.repository.find({
      where: { tipo: TipoServicio.ADDON, parent_servicio_id: parentId, activo: true, deleted_at: null as any },
      order: { nombre: 'ASC' },
    });
  }

  async create(dto: CreateServicioDto): Promise<Servicio> {
    if (dto.tipo === TipoServicio.ADDON && !dto.parent_servicio_id) {
      throw new BadRequestException('Un add-on debe tener un servicio padre');
    }

    if (dto.tipo === TipoServicio.PRINCIPAL && dto.parent_servicio_id) {
      throw new BadRequestException('Un servicio principal no puede tener servicio padre');
    }

    if (dto.parent_servicio_id) {
      const parent = await this.repository.findOne({
        where: { id: dto.parent_servicio_id, tipo: TipoServicio.PRINCIPAL, deleted_at: null as any },
      });
      if (!parent) throw new BadRequestException('El servicio padre no existe o no es principal');
    }

    if (dto.id_categoria) {
      const categoria = await this.categoriaRepository.findOneBy({ id: dto.id_categoria });
      if (!categoria) throw new BadRequestException('La categoría no existe');
    }

    const exists = await this.repository.findOne({ where: { nombre: dto.nombre, deleted_at: null as any } });
    if (exists) throw new ConflictException(`El servicio "${dto.nombre}" ya existe`);

    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateServicioDto): Promise<Servicio> {
    const entity = await this.findById(id);

    if (dto.nombre && dto.nombre !== entity.nombre) {
      const exists = await this.repository.findOne({ where: { nombre: dto.nombre, deleted_at: null as any } });
      if (exists && exists.id !== id) throw new ConflictException(`El servicio "${dto.nombre}" ya existe`);
    }

    if (dto.parent_servicio_id) {
      const parent = await this.repository.findOne({
        where: { id: dto.parent_servicio_id, tipo: TipoServicio.PRINCIPAL, deleted_at: null as any },
      });
      if (!parent) throw new BadRequestException('El servicio padre no existe o no es principal');
    }

    if (dto.id_categoria) {
      const categoria = await this.categoriaRepository.findOneBy({ id: dto.id_categoria });
      if (!categoria) throw new BadRequestException('La categoría no existe');
    }

    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.softRemove(entity);
  }
}
