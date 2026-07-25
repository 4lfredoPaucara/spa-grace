import type { DiaSemana } from '../enums/dia-semana.enum';

export interface Disponibilidad {
  id: number;
  idEmpleado: number;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}
