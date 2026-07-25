export type EstadoPago = 'pendiente_adelanto' | 'adelanto_pagado' | 'pagado_completo' | 'cancelado' | 'reembolsado';

export const ESTADO_PAGO_COLORS: Record<EstadoPago, string> = {
  pendiente_adelanto: 'bg-yellow-100 text-yellow-800',
  adelanto_pagado:    'bg-blue-100 text-blue-800',
  pagado_completo:    'bg-green-100 text-green-800',
  cancelado:          'bg-gray-100 text-gray-800',
  reembolsado:        'bg-purple-100 text-purple-800',
};

export const ESTADO_PAGO_LABELS: Record<EstadoPago, string> = {
  pendiente_adelanto: 'Pendiente de adelanto',
  adelanto_pagado:    'Adelanto pagado',
  pagado_completo:    'Pagado completo',
  cancelado:          'Cancelado',
  reembolsado:        'Reembolsado',
};

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta_debito' | 'tarjeta_credito' | 'mercadopago' | 'otro';
