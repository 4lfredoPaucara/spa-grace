import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Rol, Sexo } from '../../../common/enums';
import { Empleado } from '../../empleados/entities/empleado.entity';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Rol, default: Rol.CLIENTE })
  rol: Rol;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_nacimiento: Date | null;

  @Column({ type: 'enum', enum: Sexo, nullable: true })
  sexo: Sexo | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar_url: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_registro: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @OneToOne(() => Empleado, (empleado) => empleado.usuario)
  empleado: Empleado;

  @OneToOne(() => Cliente, (cliente) => cliente.usuario)
  cliente: Cliente;
}
