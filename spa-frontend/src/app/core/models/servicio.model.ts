export interface Servicio {
  id: number;
  idCategoria: number | null;
  categoria?: CategoriaServicio;
  nombre: string;
  descripcion: string | null;
  duracion: number;
  precio: number;
  tipo: 'principal' | 'addon';
  parentServicioId: number | null;
  parentServicio?: Servicio;
  addons?: Servicio[];
  imagenUrl: string | null;
  activo: boolean;
}

export interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
}
