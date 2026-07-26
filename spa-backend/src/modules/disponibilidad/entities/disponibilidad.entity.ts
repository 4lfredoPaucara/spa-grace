import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';
import { DiaSemana } from '../../../common/enums';

@Entity('disponibilidad_empleados')
export class Disponibilidad {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  id_empleado: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @Column({ type: 'enum', enum: DiaSemana })
  dia_semana: DiaSemana;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
