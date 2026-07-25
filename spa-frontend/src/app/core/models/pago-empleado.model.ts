import type { Empleado } from './empleado.model';

export interface PagoEmpleado {
  id: number;
  idEmpleado: number;
  empleado?: Empleado;
  fechaPago: string;
  periodoInicio: string;
  periodoFin: string;
  montoBruto: number;
  deducciones: number;
  montoNeto: number;
  metodoPago: string | null;
  referenciaPago: string | null;
  notas: string | null;
}
