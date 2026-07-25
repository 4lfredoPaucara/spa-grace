import type { TipoDescuento } from '../enums/tipo-descuento.enum';

export type AlcancePromocion = 'todos' | 'servicio_especifico' | 'categoria' | 'cumpleanos';

export interface Promocion {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  codigoDescuento: string | null;
  tipoDescuento: TipoDescuento | null;
  valorDescuento: number | null;
  aplicaA: AlcancePromocion;
  idServicioAplicable: number | null;
  idCategoriaAplicable: number | null;
  activo: boolean;
}
