import type { User } from './user.model';
import type { Turno } from './turno.model';

export interface HistorialClinico {
  id: number;
  idCliente: number;
  cliente?: User;
  idTurno: number | null;
  turno?: Turno;
  fecha: string;
  diagnostico: string | null;
  tratamiento: string | null;
  notas: string | null;
  archivoUrl: string | null;
}
