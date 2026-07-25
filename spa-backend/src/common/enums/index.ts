export enum Rol {
  ADMIN = 'admin',
  RECEPCIONISTA = 'recepcionista',
  TERAPEUTA = 'terapeuta',
  CLIENTE = 'cliente',
}

export enum EstadoTurno {
  PENDIENTE = 'pendiente',
  CONFIRMADO = 'confirmado',
  CANCELADO = 'cancelado',
  ATENDIDO = 'atendido',
  AUSENTE = 'ausente',
  REPROGRAMADO = 'reprogramado',
}

export enum EstadoPago {
  PENDIENTE_ADELANTO = 'pendiente_adelanto',
  ADELANTO_PAGADO = 'adelanto_pagado',
  PAGADO_COMPLETO = 'pagado_completo',
  CANCELADO = 'cancelado',
  REEMBOLSADO = 'reembolsado',
}

export enum TipoServicio {
  PRINCIPAL = 'principal',
  ADDON = 'addon',
}

export enum TipoDescuento {
  PORCENTAJE = 'porcentaje',
  FIJO = 'fijo',
}

export enum AlcancePromocion {
  TODOS = 'todos',
  SERVICIO_ESPECIFICO = 'servicio_especifico',
  CATEGORIA = 'categoria',
  CUMPLEANOS = 'cumpleanos',
}

export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

export enum Sexo {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  OTRO = 'Otro',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TRANSFERENCIA = 'transferencia',
  TARJETA_DEBITO = 'tarjeta_debito',
  TARJETA_CREDITO = 'tarjeta_credito',
  MERCADOPAGO = 'mercadopago',
  OTRO = 'otro',
}

export enum ComoConocio {
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  RECOMENDACION = 'recomendacion',
  PASO_POR_EL_LOCAL = 'paso_por_el_local',
  OTRO = 'otro',
}
