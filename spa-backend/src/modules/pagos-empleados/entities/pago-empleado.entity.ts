import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Empleado } from '../../empleados/entities/empleado.entity';

@Entity('pagos_empleados')
export class PagoEmpleado {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'id_empleado' })
  empleado: Empleado;

  @Column({ type: 'date' })
  fecha_pago: string;

  @Column({ type: 'date' })
  periodo_inicio: string;

  @Column({ type: 'date' })
  periodo_fin: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_bruto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deducciones: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, select: false })
  monto_neto: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  metodo_pago: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia_pago: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
