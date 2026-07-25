import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';

@Entity('empleados')
export class Empleado {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', unique: true })
  id_usuario: number;

  @OneToOne(() => User, (user) => user.empleado)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ type: 'varchar', length: 100, nullable: true })
  especialidad: string | null;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;

  @ManyToMany(() => Servicio, (servicio) => servicio.empleados)
  @JoinTable({
    name: 'empleados_servicios',
    joinColumn: { name: 'id_empleado', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_servicio', referencedColumnName: 'id' },
  })
  servicios: Servicio[];
}
