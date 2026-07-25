import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cliente } from './entities/cliente.entity';
import { User } from '../users/entities/user.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces';
import { Rol } from '../../common/enums';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: PaginationDto): Promise<PaginatedResult<Cliente>> {
    const { page = 1, limit = 10, search } = query;

    const qb = this.clienteRepository.createQueryBuilder('cliente')
      .leftJoinAndSelect('cliente.usuario', 'usuario')
      .where('usuario.deleted_at IS NULL');

    if (search) {
      qb.andWhere('(usuario.nombre LIKE :search OR usuario.email LIKE :search OR usuario.telefono LIKE :search)', { search: `%${search}%` });
    }

    qb.orderBy('usuario.nombre', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: page < Math.ceil(total / limit), hasPreviousPage: page > 1 },
    };
  }

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({
      where: { id },
      relations: { usuario: true },
    });

    if (!cliente) throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    return cliente;
  }

  async create(dto: CreateClienteDto): Promise<Cliente> {
    const existingEmail = await this.userRepository.findOne({
      where: { email: dto.email, deleted_at: null as any },
    });
    if (existingEmail) throw new ConflictException('El email ya está en uso');

    const username = dto.email.split('@')[0] + Math.floor(Math.random() * 1000);
    const tempPassword = Math.random().toString(36).slice(-8);

    const user = this.userRepository.create({
      nombre: dto.nombre,
      email: dto.email,
      username,
      password: await bcrypt.hash(tempPassword, BCRYPT_SALT_ROUNDS),
      rol: Rol.CLIENTE,
      telefono: dto.telefono || null,
    });

    const savedUser = await this.userRepository.save(user);

    const cliente = this.clienteRepository.create({
      id_usuario: savedUser.id,
      direccion: dto.direccion || null,
      ocupacion: dto.ocupacion || null,
      como_conocio: dto.como_conocio || null,
      alergias: dto.alergias || null,
      notas_internas: dto.notas_internas || null,
    });

    return this.clienteRepository.save(cliente);
  }

  async update(id: number, dto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findById(id);

    if (dto.nombre || dto.email || dto.telefono) {
      const user = await this.userRepository.findOneBy({ id: cliente.id_usuario });
      if (user) {
        if (dto.email && dto.email !== user.email) {
          const exists = await this.userRepository.findOne({ where: { email: dto.email, deleted_at: null as any } });
          if (exists) throw new ConflictException('El email ya está en uso');
        }
        Object.assign(user, {
          nombre: dto.nombre ?? user.nombre,
          email: dto.email ?? user.email,
          telefono: dto.telefono !== undefined ? (dto.telefono || null) : user.telefono,
        });
        await this.userRepository.save(user);
      }
    }

    Object.assign(cliente, {
      direccion: dto.direccion !== undefined ? (dto.direccion || null) : cliente.direccion,
      ocupacion: dto.ocupacion !== undefined ? (dto.ocupacion || null) : cliente.ocupacion,
      como_conocio: dto.como_conocio !== undefined ? (dto.como_conocio || null) : cliente.como_conocio,
      alergias: dto.alergias !== undefined ? (dto.alergias || null) : cliente.alergias,
      notas_internas: dto.notas_internas !== undefined ? (dto.notas_internas || null) : cliente.notas_internas,
    });

    return this.clienteRepository.save(cliente);
  }

  async findByUsuarioId(idUsuario: number): Promise<Cliente | null> {
    return this.clienteRepository.findOne({
      where: { id_usuario: idUsuario },
      relations: { usuario: true },
    });
  }

  async getHistorial(id: number, query: PaginationDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 10 } = query;
    const cliente = await this.findById(id);

    // Placeholder hasta implementar HistorialesModule
    return {
      data: [],
      meta: { total: 0, page, limit, totalPages: 0, hasNextPage: false, hasPreviousPage: false },
    };
  }
}
