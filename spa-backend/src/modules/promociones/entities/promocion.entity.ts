import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
import { TipoDescuento, AlcancePromocion } from '../../../common/enums';

@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen_url: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_inicio: string | null;

  @Column({ type: 'date', nullable: true })
  fecha_fin: string | null;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: true })
  codigo_descuento: string | null;

  @Column({ type: 'enum', enum: TipoDescuento, nullable: true })
  tipo_descuento: TipoDescuento | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor_descuento: number | null;

  @Column({ type: 'enum', enum: AlcancePromocion, default: AlcancePromocion.TODOS })
  aplica_a: AlcancePromocion;

  @ManyToOne(() => Servicio, { nullable: true })
  @JoinColumn({ name: 'id_servicio_aplicable' })
  servicioAplicable: Servicio | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creado_por_id' })
  creadoPor: User;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_creacion: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date | null;
}
