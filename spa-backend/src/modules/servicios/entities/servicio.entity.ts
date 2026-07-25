import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, ManyToMany, OneToMany, JoinColumn } from 'typeorm';
import { CategoriaServicio } from './categoria-servicio.entity';
import { Empleado } from '../../empleados/entities/empleado.entity';
import { TipoServicio } from '../../../common/enums';

@Entity('servicios')
export class Servicio {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => CategoriaServicio, { nullable: true })
  @JoinColumn({ name: 'id_categoria' })
  categoria: CategoriaServicio | null;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'int' })
  duracion: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'enum', enum: TipoServicio, default: TipoServicio.PRINCIPAL })
  tipo: TipoServicio;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int', nullable: true })
  parent_servicio_id: number | null;

  @ManyToOne(() => Servicio, (servicio) => servicio.addons, { nullable: true })
  @JoinColumn({ name: 'parent_servicio_id' })
  parentServicio: Servicio | null;

  @OneToMany(() => Servicio, (servicio) => servicio.parentServicio)
  addons: Servicio[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToMany(() => Empleado, (empleado) => empleado.servicios)
  empleados: Empleado[];
}
