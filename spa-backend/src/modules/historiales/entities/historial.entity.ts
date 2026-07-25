import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Turno } from '../../turnos/entities/turno.entity';

@Entity('historiales_clinicos')
export class HistorialClinico {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_cliente' })
  cliente: User;

  @ManyToOne(() => Turno, { nullable: true })
  @JoinColumn({ name: 'id_turno' })
  turno: Turno | null;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'text', nullable: true })
  diagnostico: string | null;

  @Column({ type: 'text', nullable: true })
  tratamiento: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  archivo_url: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
