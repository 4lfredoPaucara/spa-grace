import { Pipe, PipeTransform } from '@angular/core';
import { ESTADO_TURNO_COLORS, type EstadoTurno } from '../../core/enums/estado-turno.enum';
import { ESTADO_PAGO_COLORS, type EstadoPago } from '../../core/enums/estado-pago.enum';
import { ESTADO_TURNO_LABELS } from '../../core/enums/estado-turno.enum';
import { ESTADO_PAGO_LABELS } from '../../core/enums/estado-pago.enum';

@Pipe({ name: 'estadoColor', standalone: true })
export class EstadoColorPipe implements PipeTransform {
  transform(value: EstadoTurno | EstadoPago | null | undefined): string {
    if (!value) return '';
    return ESTADO_TURNO_COLORS[value as EstadoTurno] || ESTADO_PAGO_COLORS[value as EstadoPago] || '';
  }
}

@Pipe({ name: 'estadoLabel', standalone: true })
export class EstadoLabelPipe implements PipeTransform {
  transform(value: EstadoTurno | EstadoPago | null | undefined): string {
    if (!value) return '';
    return ESTADO_TURNO_LABELS[value as EstadoTurno] || ESTADO_PAGO_LABELS[value as EstadoPago] || value;
  }
}
