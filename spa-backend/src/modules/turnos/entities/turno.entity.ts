import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Empleado } from '../../empleados/entities/empleado.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
import { EstadoTurno } from '../../../common/enums';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_cliente' })
  cliente: User;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @ManyToMany(() => Servicio)
  @JoinTable({
    name: 'turnos_servicios',
    joinColumn: { name: 'id_turno', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_servicio', referencedColumnName: 'id' },
  })
  servicios: Servicio[];

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'int' })
  duracion_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_total: number;

  @Column({ type: 'enum', enum: EstadoTurno, default: EstadoTurno.PENDIENTE })
  estado: EstadoTurno;

  @Column({ type: 'text', nullable: true })
  notas_turno: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
