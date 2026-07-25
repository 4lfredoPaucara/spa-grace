import type { User } from './user.model';

export interface Cliente {
  id: number;
  idUsuario: number;
  usuario?: User;
  direccion: string | null;
  ocupacion: string | null;
  comoConocio: string | null;
  alergias: string | null;
  notasInternas: string | null;
}
