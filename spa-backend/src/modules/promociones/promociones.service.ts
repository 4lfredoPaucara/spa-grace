import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promocion } from './entities/promocion.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';
import { AlcancePromocion } from '../../common/enums';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion)
    private readonly repository: Repository<Promocion>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<Promocion>> {
    const { page = 1, limit = 10, search } = query;

    const qb = this.repository.createQueryBuilder('promocion')
      .leftJoinAndSelect('promocion.servicioAplicable', 'servicio')
      .leftJoinAndSelect('promocion.creadoPor', 'creador')
      .where('promocion.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(promocion.titulo LIKE :search OR promocion.codigo_descuento LIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy('promocion.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Promocion> {
    const entity = await this.repository.findOne({
      where: { id, deleted_at: null as any },
      relations: { servicioAplicable: true, creadoPor: true },
    });
    if (!entity) throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    return entity;
  }

  async create(dto: CreatePromocionDto, userId: number): Promise<Promocion> {
    const exists = await this.repository.findOne({
      where: { codigo_descuento: dto.codigo_descuento, deleted_at: null as any },
    });
    if (exists) throw new ConflictException('El código de descuento ya existe');

    if (dto.id_servicio_aplicable) {
      const servicio = await this.servicioRepository.findOne({ where: { id: dto.id_servicio_aplicable, deleted_at: null as any } });
      if (!servicio) throw new BadRequestException('Servicio no encontrado');
    }

    return this.repository.save(this.repository.create({ ...dto, creado_por_id: userId }));
  }

  async update(id: number, dto: UpdatePromocionDto): Promise<Promocion> {
    const entity = await this.findById(id);

    if (dto.codigo_descuento && dto.codigo_descuento !== entity.codigo_descuento) {
      const exists = await this.repository.findOne({
        where: { codigo_descuento: dto.codigo_descuento, deleted_at: null as any },
      });
      if (exists) throw new ConflictException('El código de descuento ya existe');
    }

    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async softDelete(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.softRemove(entity);
  }

  async activar(id: number): Promise<Promocion> {
    const entity = await this.findById(id);
    entity.activo = true;
    return this.repository.save(entity);
  }

  async desactivar(id: number): Promise<Promocion> {
    const entity = await this.findById(id);
    entity.activo = false;
    return this.repository.save(entity);
  }

  async validarCodigo(codigo: string, idServicio?: number): Promise<{ valido: boolean; promocion?: Partial<Promocion>; message?: string }> {
    const promocion = await this.repository.findOne({
      where: { codigo_descuento: codigo, activo: true, deleted_at: null as any },
      relations: { servicioAplicable: true },
    });

    if (!promocion) return { valido: false, message: 'Código de descuento inválido' };

    const hoy = new Date().toISOString().split('T')[0];
    if (promocion.fecha_inicio && promocion.fecha_inicio > hoy) {
      return { valido: false, message: 'La promoción aún no está vigente' };
    }
    if (promocion.fecha_fin && promocion.fecha_fin < hoy) {
      return { valido: false, message: 'La promoción ha expirado' };
    }

    if (promocion.aplica_a === AlcancePromocion.SERVICIO_ESPECIFICO && idServicio && promocion.servicioAplicable) {
      if (promocion.servicioAplicable.id !== Number(idServicio)) {
        return { valido: false, message: 'Esta promoción no aplica a este servicio' };
      }
    }

    return { valido: true, promocion: { titulo: promocion.titulo, tipo_descuento: promocion.tipo_descuento, valor_descuento: promocion.valor_descuento } };
  }
}
