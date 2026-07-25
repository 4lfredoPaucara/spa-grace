import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants';
import { PaginatedResult } from '../../common/interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 10, rol, search, sortBy = 'created_at', sortOrder = 'DESC' } = query;
    const where: FindOptionsWhere<User> = {};

    if (rol) {
      where.rol = rol;
    }

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.deleted_at IS NULL');

    if (rol) {
      queryBuilder.andWhere('user.rol = :rol', { rol });
    }

    if (search) {
      queryBuilder.andWhere(
        '(user.nombre LIKE :search OR user.email LIKE :search OR user.username LIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`user.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, deleted_at: null as any },
      relations: { empleado: { servicios: true }, cliente: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deleted_at: null as any },
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username, deleted_at: null as any },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existingEmail = await this.findByEmail(dto.email);
    if (existingEmail) {
      throw new ConflictException('El email ya está en uso');
    }

    if (dto.username) {
      const existingUsername = await this.findByUsername(dto.username);
      if (existingUsername) {
        throw new ConflictException('El username ya está en uso');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.findByEmail(dto.email);
      if (existing) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    if (dto.username && dto.username !== user.username) {
      const existing = await this.findByUsername(dto.username);
      if (existing) {
        throw new ConflictException('El username ya está en uso');
      }
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    }

    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async softDelete(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softRemove(user);
  }

  async findByIdWithPassword(id: number): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .andWhere('user.deleted_at IS NULL')
      .getOne();
  }
}
