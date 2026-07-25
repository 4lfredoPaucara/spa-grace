import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'int' })
  id_usuario: number;

  @Column({ type: 'varchar', length: 500, unique: true })
  token: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
