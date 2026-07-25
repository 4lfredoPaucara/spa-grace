import type { User } from './user.model';
import type { Empleado } from './empleado.model';
import type { Servicio } from './servicio.model';
import type { Cobro } from './cobro.model';
import type { EstadoTurno } from '../enums/estado-turno.enum';

export interface Turno {
  id: number;
  cliente: User;
  empleado: Empleado;
  servicios: Servicio[];
  fecha: string;
  hora: string;
  horaFin: string;
  duracionTotal: number;
  precioTotal: number;
  estado: EstadoTurno;
  notasTurno: string | null;
  cobro: Cobro;
  fechaCreacion: string;
}
