import type { EstadoPago } from '../enums/estado-pago.enum';

export interface Cobro {
  id: number;
  idTurno: number;
  montoTotal: number;
  montoAdelanto: number;
  montoPendiente: number;
  metodoPagoAdelanto: string | null;
  metodoPagoFinal: string | null;
  fechaAdelanto: string | null;
  fechaCobroFinal: string | null;
  estadoPago: EstadoPago;
  promocionAplicada: string | null;
  notas: string | null;
}
