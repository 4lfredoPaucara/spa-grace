import type { User } from './user.model';
import type { Servicio } from './servicio.model';

export interface Empleado {
  id: number;
  idUsuario: number;
  usuario?: User;
  idEspecialidad: number | null;
  especialidad?: Especialidad;
  activo: boolean;
  servicios: Servicio[];
}

export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}
