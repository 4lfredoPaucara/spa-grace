import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Disponibilidad } from './entities/disponibilidad.entity';
import { Empleado } from '../empleados/entities/empleado.entity';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
import { CreateLoteDto } from './dto/create-lote.dto';

@Injectable()
export class DisponibilidadService {
  constructor(
    @InjectRepository(Disponibilidad)
    private readonly repository: Repository<Disponibilidad>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    private readonly dataSource: DataSource,
  ) {}

  async findByEmpleado(idEmpleado: number): Promise<Disponibilidad[]> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id: idEmpleado, deleted_at: null as any },
    });
    if (!empleado) throw new NotFoundException('Empleado no encontrado');

    return this.repository.find({
      where: { id_empleado: idEmpleado },
      order: { dia_semana: 'ASC', hora_inicio: 'ASC' },
    });
  }

  async findById(id: number): Promise<Disponibilidad> {
    const entity = await this.repository.findOne({ where: { id }, relations: { empleado: { usuario: true } } });
    if (!entity) throw new NotFoundException(`Disponibilidad con ID ${id} no encontrada`);
    return entity;
  }

  async create(dto: CreateDisponibilidadDto): Promise<Disponibilidad> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id: dto.id_empleado, activo: true, deleted_at: null as any },
    });
    if (!empleado) throw new BadRequestException('Empleado no encontrado o inactivo');

    if (dto.hora_inicio >= dto.hora_fin) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin');
    }

    return this.repository.save(this.repository.create(dto));
  }

  async update(id: number, dto: UpdateDisponibilidadDto): Promise<Disponibilidad> {
    const entity = await this.findById(id);
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findById(id);
    await this.repository.remove(entity);
  }

  async createLote(dto: CreateLoteDto): Promise<Disponibilidad[]> {
    const empleado = await this.empleadoRepository.findOne({
      where: { id: dto.id_empleado, activo: true, deleted_at: null as any },
    });
    if (!empleado) throw new BadRequestException('Empleado no encontrado o inactivo');

    const results: Disponibilidad[] = [];
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Disponibilidad, { id_empleado: dto.id_empleado });

      for (const h of dto.horarios) {
        if (h.hora_inicio >= h.hora_fin) {
          throw new BadRequestException(`La hora de inicio debe ser anterior a la de fin para ${h.dia_semana}`);
        }

        const disp = queryRunner.manager.create(Disponibilidad, {
          id_empleado: dto.id_empleado,
          dia_semana: h.dia_semana as any,
          hora_inicio: h.hora_inicio,
          hora_fin: h.hora_fin,
          activo: true,
        });
        results.push(await queryRunner.manager.save(Disponibilidad, disp));
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }

    return results;
  }
}
