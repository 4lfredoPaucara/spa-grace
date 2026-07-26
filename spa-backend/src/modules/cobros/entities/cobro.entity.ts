import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Turno } from '../../turnos/entities/turno.entity';
import { EstadoPago } from '../../../common/enums';

@Entity('cobros')
export class Cobro {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  id_turno: number;

  @OneToOne(() => Turno)
  @JoinColumn({ name: 'id_turno' })
  turno: Turno;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  monto_adelanto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, select: false })
  monto_pendiente: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  metodo_pago_adelanto: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  metodo_pago_final: string | null;

  @Column({ type: 'datetime', nullable: true })
  fecha_adelanto: Date | null;

  @Column({ type: 'datetime', nullable: true })
  fecha_cobro_final: Date | null;

  @Column({ type: 'enum', enum: EstadoPago, default: EstadoPago.PENDIENTE_ADELANTO })
  estado_pago: EstadoPago;

  @Column({ type: 'varchar', length: 50, nullable: true })
  promocion_aplicada: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
