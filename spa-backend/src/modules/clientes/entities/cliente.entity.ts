import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int', unique: true })
  id_usuario: number;

  @OneToOne(() => User, (user) => user.cliente)
  @JoinColumn({ name: 'id_usuario' })
  usuario: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ocupacion: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  como_conocio: string | null;

  @Column({ type: 'text', nullable: true })
  alergias: string | null;

  @Column({ type: 'text', nullable: true })
  notas_internas: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
