# Documento para Experto en Frontend - Proyecto SpaGrace

---

## STACK Y VERSIONES ACTUALES

| Tecnología | Versión | Notas |
|-----------|---------|-------|
| Node.js | 24.18.0 | Runtime |
| Angular (core) | 22.0.8 | Framework SPA |
| Angular CLI | 22.0.8 | Herramienta CLI |
| TypeScript | 7.0.2 | Lenguaje tipado |
| RxJS | 7.8.2 | Programación reactiva |
| Tailwind CSS | 4.3.3 | Framework CSS |
| ApexCharts | 6.5.0 | Librería de gráficos |
| ng-apexcharts | 2.4.0 | Wrapper Angular para ApexCharts |

---

## ARQUITECTURA FRONTEND

```
spa-frontend/
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.css                     # Tailwind CSS directivas
│   └── app/
│       ├── app.config.ts              # Configuración global (providers)
│       ├── app.routes.ts              # Definición de rutas
│       │
│       ├── core/                      # Singleton services, guards, interceptors
│       │   ├── guards/
│       │   │   ├── auth.guard.ts
│       │   │   └── role.guard.ts
│       │   ├── interceptors/
│       │   │   ├── auth.interceptor.ts
│       │   │   ├── error.interceptor.ts
│       │   │   └── loading.interceptor.ts
│       │   ├── models/
│       │   │   ├── user.model.ts
│       │   │   ├── cliente.model.ts
│       │   │   ├── empleado.model.ts
│       │   │   ├── servicio.model.ts
│       │   │   ├── turno.model.ts
│       │   │   ├── cobro.model.ts
│       │   │   ├── promocion.model.ts
│       │   │   ├── historial.model.ts
│       │   │   ├── disponibilidad.model.ts
│       │   │   ├── pago-empleado.model.ts
│       │   │   └── pagination.model.ts
│       │   └── enums/
│       │       ├── rol.enum.ts
│       │       ├── estado-turno.enum.ts
│       │       ├── estado-pago.enum.ts
│       │       ├── tipo-descuento.enum.ts
│       │       ├── tipo-servicio.enum.ts
│       │       └── dia-semana.enum.ts
│       │
│       ├── shared/                    # Componentes reusables
│       │   ├── components/
│       │   │   ├── data-table/
│       │   │   │   ├── data-table.component.ts
│       │   │   │   └── data-table.component.html
│       │   │   ├── search-input/
│       │   │   │   ├── search-input.component.ts
│       │   │   │   └── search-input.component.html
│       │   │   ├── status-badge/
│       │   │   │   ├── status-badge.component.ts
│       │   │   │   └── status-badge.component.html
│       │   │   ├── confirm-modal/
│       │   │   │   ├── confirm-modal.component.ts
│       │   │   │   └── confirm-modal.component.html
│       │   │   ├── toast-notification/
│       │   │   │   ├── toast.component.ts
│       │   │   │   └── toast.service.ts
│       │   │   ├── loading-spinner/
│       │   │   │   └── loading-spinner.component.ts
│       │   │   └── empty-state/
│       │   │       └── empty-state.component.ts
│       │   ├── pipes/
│       │   │   ├── readable-date.pipe.ts
│       │   │   ├── currency.pipe.ts
│       │   │   ├── phone.pipe.ts
│       │   │   └── estado-color.pipe.ts
│       │   └── validators/
│       │       ├── password.validator.ts
│       │       └── fecha.validator.ts
│       │
│       └── features/                  # Módulos de funcionalidad (lazy-loaded)
│           ├── auth/
│           │   ├── pages/
│           │   │   └── login/
│           │   │       ├── login.component.ts
│           │   │       ├── login.component.html
│           │   │       └── login.component.css
│           │   └── services/
│           │       └── auth.service.ts
│           │
│           ├── dashboard/
│           │   ├── layout/
│           │   │   ├── dashboard-layout.component.ts
│           │   │   ├── dashboard-layout.component.html
│           │   │   ├── sidebar.component.ts
│           │   │   └── header.component.ts
│           │   ├── home/
│           │   │   ├── home.component.ts
│           │   │   └── home.component.html
│           │   ├── agenda/
│           │   │   ├── agenda.component.ts
│           │   │   ├── agenda.component.html
│           │   │   ├── turno-form/
│           │   │   │   ├── turno-form.component.ts
│           │   │   │   └── turno-form.component.html
│           │   │   └── pago-form/
│           │   │       ├── pago-form.component.ts
│           │   │       └── pago-form.component.html
│           │   ├── servicios/
│           │   │   ├── servicios.component.ts
│           │   │   ├── servicios.component.html
│           │   │   └── servicio-form/
│           │   │       ├── servicio-form.component.ts
│           │   │       └── servicio-form.component.html
│           │   ├── personal/
│           │   │   ├── personal.component.ts
│           │   │   ├── personal.component.html
│           │   │   └── empleado-form/
│           │   │       ├── empleado-form.component.ts
│           │   │       └── empleado-form.component.html
│           │   ├── clientes/
│           │   │   ├── clientes.component.ts
│           │   │   └── cliente-form/
│           │   │       ├── cliente-form.component.ts
│           │   │       └── cliente-form.component.html
│           │   ├── promociones/
│           │   │   ├── promociones.component.ts
│           │   │   └── promocion-form/
│           │   │       ├── promocion-form.component.ts
│           │   │       └── promocion-form.component.html
│           │   ├── historiales/
│           │   │   ├── historiales.component.ts
│           │   │   └── historial-form/
│           │   │       ├── historial-form.component.ts
│           │   │       └── historial-form.component.html
│           │   ├── disponibilidad/
│           │   │   └── disponibilidad.component.ts
│           │   └── pagos-empleados/
│           │       ├── pagos-empleados.component.ts
│           │       └── pago-empleado-form/
│           │           ├── pago-empleado-form.component.ts
│           │           └── pago-empleado-form.component.html
│           │
│           └── services/              # Servicios HTTP por dominio
│               ├── base-api.service.ts
│               ├── usuarios.service.ts
│               ├── clientes.service.ts
│               ├── empleados.service.ts
│               ├── servicios.service.ts
│               ├── turnos.service.ts
│               ├── cobros.service.ts
│               ├── promociones.service.ts
│               ├── historiales.service.ts
│               ├── disponibilidad.service.ts
│               ├── pagos-empleados.service.ts
│               └── reports.service.ts
```

---

## DEFINICIÓN DE RUTAS

```typescript
// app.routes.ts
export const routes: Routes = [
  // Público
  { path: 'login', loadComponent: () => import('./features/auth/pages/login/login.component') },

  // Dashboard protegido (lazy-loaded)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/layout/dashboard-layout.component'),
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./features/dashboard/home/home.component')
      },
      {
        path: 'agenda',
        canActivate: [roleGuard(['admin', 'recepcionista'])],
        loadComponent: () => import('./features/dashboard/agenda/agenda.component')
      },
      {
        path: 'servicios',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/servicios/servicios.component')
      },
      {
        path: 'personal',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/personal/personal.component')
      },
      {
        path: 'clientes',
        canActivate: [roleGuard(['admin', 'recepcionista'])],
        loadComponent: () => import('./features/dashboard/clientes/clientes.component')
      },
      {
        path: 'promociones',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/promociones/promociones.component')
      },
      {
        path: 'historiales',
        canActivate: [roleGuard(['admin', 'recepcionista', 'terapeuta'])],
        loadComponent: () => import('./features/dashboard/historiales/historiales.component')
      },
      {
        path: 'disponibilidad',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/disponibilidad/disponibilidad.component')
      },
      {
        path: 'pagos-empleados',
        canActivate: [roleGuard(['admin'])],
        loadComponent: () => import('./features/dashboard/pagos-empleados/pagos-empleados.component')
      }
    ]
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];
```

---

## API BASE URL Y ENDPOINTS

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1'
};
```

### Todos los endpoints que el frontend debe consumir:

```
AUTH:
  POST   /api/v1/auth/login
  POST   /api/v1/auth/register
  POST   /api/v1/auth/refresh
  GET    /api/v1/auth/profile
  POST   /api/v1/auth/change-password
  POST   /api/v1/auth/logout

USUARIOS:
  GET    /api/v1/users?page=&limit=&rol=&search=
  GET    /api/v1/users/:id
  PATCH  /api/v1/users/:id
  DELETE /api/v1/users/:id
  GET    /api/v1/users/me
  PATCH  /api/v1/users/me

CLIENTES:
  GET    /api/v1/clientes?page=&limit=&search=
  GET    /api/v1/clientes/:id
  POST   /api/v1/clientes
  PATCH  /api/v1/clientes/:id
  GET    /api/v1/clientes/:id/historial
  GET    /api/v1/clientes/:id/turnos

EMPLEADOS:
  GET    /api/v1/empleados?page=&limit=&activo=&search=
  GET    /api/v1/empleados/:id
  POST   /api/v1/empleados
  PATCH  /api/v1/empleados/:id
  DELETE /api/v1/empleados/:id
  POST   /api/v1/empleados/:id/servicios
  DELETE /api/v1/empleados/:id/servicios/:servicioId
  GET    /api/v1/empleados/:id/disponibilidad
  GET    /api/v1/empleados/:id/turnos
  GET    /api/v1/empleados/disponibles?fecha=&hora=&servicioIds=

SERVICIOS:
  GET    /api/v1/servicios?page=&limit=&categoriaId=&activo=&search=&tipo=
  GET    /api/v1/servicios/:id
  POST   /api/v1/servicios
  PATCH  /api/v1/servicios/:id
  DELETE /api/v1/servicios/:id
  GET    /api/v1/servicios/categorias
  GET    /api/v1/servicios/principales
  GET    /api/v1/servicios/addons/:parentId

TURNOS:
  GET    /api/v1/turnos?page=&limit=&estado=&fecha=&empleadoId=&clienteId=&search=
  GET    /api/v1/turnos/:id
  POST   /api/v1/turnos
  PATCH  /api/v1/turnos/:id
  DELETE /api/v1/turnos/:id
  GET    /api/v1/turnos/calendario?fecha=&empleadoId=
  PATCH  /api/v1/turnos/:id/confirmar
  PATCH  /api/v1/turnos/:id/atender
  PATCH  /api/v1/turnos/:id/reprogramar

COBROS:
  GET    /api/v1/cobros?page=&limit=&estadoPago=&fechaDesde=&fechaHasta=
  GET    /api/v1/cobros/:id
  PATCH  /api/v1/cobros/:id
  POST   /api/v1/cobros/:id/aplicar-descuento
  POST   /api/v1/cobros/:id/registrar-adelanto
  POST   /api/v1/cobros/:id/registrar-pago-final
  POST   /api/v1/cobros/:id/reembolsar

DISPONIBILIDAD:
  GET    /api/v1/disponibilidad?empleadoId=
  POST   /api/v1/disponibilidad
  PATCH  /api/v1/disponibilidad/:id
  DELETE /api/v1/disponibilidad/:id
  POST   /api/v1/disponibilidad/lote

HISTORIALES:
  GET    /api/v1/historiales?clienteId=&page=&limit=
  GET    /api/v1/historiales/:id
  POST   /api/v1/historiales
  PATCH  /api/v1/historiales/:id
  DELETE /api/v1/historiales/:id
  POST   /api/v1/historiales/:id/upload

PROMOCIONES:
  GET    /api/v1/promociones?page=&limit=&activo=
  GET    /api/v1/promociones/:id
  POST   /api/v1/promociones
  PATCH  /api/v1/promociones/:id
  DELETE /api/v1/promociones/:id
  POST   /api/v1/promociones/:id/activar
  POST   /api/v1/promociones/:id/desactivar
  GET    /api/v1/promociones/validar?codigo=&servicioId=

PAGOS EMPLEADOS:
  GET    /api/v1/pagos-empleados?empleadoId=&page=&limit=
  GET    /api/v1/pagos-empleados/:id
  POST   /api/v1/pagos-empleados
  PATCH  /api/v1/pagos-empleados/:id
  DELETE /api/v1/pagos-empleados/:id

REPORTS:
  GET    /api/v1/reports/dashboard
  GET    /api/v1/reports/summary-by-status
  GET    /api/v1/reports/ingresos?periodo=&desde=&hasta=
  GET    /api/v1/reports/ingresos/diario?fecha=
  GET    /api/v1/reports/servicios-populares?desde=&hasta=&limite=
  GET    /api/v1/reports/empleados-rendimiento?desde=&hasta=
  GET    /api/v1/reports/clientes-frecuentes?limite=
  GET    /api/v1/reports/ocupacion?fecha=

ESPECIALIDADES:
  GET    /api/v1/especialidades
  POST   /api/v1/especialidades
  PATCH  /api/v1/especialidades/:id
  DELETE /api/v1/especialidades/:id

CATEGORÍAS SERVICIOS:
  GET    /api/v1/categorias-servicios
  POST   /api/v1/categorias-servicios
  PATCH  /api/v1/categorias-servicios/:id
  DELETE /api/v1/categorias-servicios/:id

HEALTH:
  GET    /api/v1/health
```

---

## FORMATO DE RESPUESTA ESTÁNDAR

```typescript
// interfaces/api-response.interface.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

---

## INTERFACES / MODELOS PRINCIPALES

```typescript
// User
export interface User {
  id: number;
  nombre: string;
  email: string;
  username: string | null;
  rol: Rol;
  telefono: string | null;
  fechaNacimiento: string | null;      // YYYY-MM-DD
  sexo: 'Masculino' | 'Femenino' | 'Otro' | null;
  avatarUrl: string | null;
  fechaRegistro: string;               // ISO 8601
  cliente?: Cliente;                   // Solo si rol='cliente'
  empleado?: Empleado;                 // Solo si rol='terapeuta'|'recepcionista'
}

// Cliente
export interface Cliente {
  id: number;
  idUsuario: number;
  usuario?: User;
  direccion: string | null;
  ocupacion: string | null;
  comoConocio: string | null;
  alergias: string | null;
  notasInternas: string | null;
}

// Empleado
export interface Empleado {
  id: number;
  idUsuario: number;
  usuario?: User;
  idEspecialidad: number | null;
  especialidad?: Especialidad;
  activo: boolean;
  servicios: Servicio[];
}

// Especialidad
export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

// Servicio
export interface Servicio {
  id: number;
  idCategoria: number | null;
  categoria?: CategoriaServicio;
  nombre: string;
  descripcion: string | null;
  duracion: number;                    // Minutos
  precio: number;
  tipo: 'principal' | 'addon';
  parentServicioId: number | null;
  parentServicio?: Servicio;
  addons?: Servicio[];
  imagenUrl: string | null;
  activo: boolean;
}

// CategoriaServicio
export interface CategoriaServicio {
  id: number;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  orden: number;
  activo: boolean;
}

// Turno
export interface Turno {
  id: number;
  cliente: User;
  empleado: Empleado;
  servicios: Servicio[];
  fecha: string;                       // YYYY-MM-DD
  hora: string;                        // HH:MM
  horaFin: string;                     // HH:MM (calculada)
  duracionTotal: number;               // Minutos
  precioTotal: number;
  estado: EstadoTurno;
  notasTurno: string | null;
  cobro: Cobro;
  fechaCreacion: string;
}

// Cobro
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

// Promocion
export interface Promocion {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string | null;
  fechaInicio: string | null;          // YYYY-MM-DD
  fechaFin: string | null;
  codigoDescuento: string | null;
  tipoDescuento: 'porcentaje' | 'fijo' | null;
  valorDescuento: number | null;
  aplicaA: 'todos' | 'servicio_especifico' | 'categoria' | 'cumpleanos';
  idServicioAplicable: number | null;
  idCategoriaAplicable: number | null;
  activo: boolean;
}

// Disponibilidad
export interface Disponibilidad {
  id: number;
  idEmpleado: number;
  diaSemana: DiaSemana;
  horaInicio: string;                  // HH:MM
  horaFin: string;                     // HH:MM
  activo: boolean;
}

// HistorialClinico
export interface HistorialClinico {
  id: number;
  idCliente: number;
  cliente?: User;
  idTurno: number | null;
  turno?: Turno;
  fecha: string;
  diagnostico: string | null;
  tratamiento: string | null;
  notas: string | null;
  archivoUrl: string | null;
}

// PagoEmpleado
export interface PagoEmpleado {
  id: number;
  idEmpleado: number;
  empleado?: Empleado;
  fechaPago: string;
  periodoInicio: string;
  periodoFin: string;
  montoBruto: number;
  deducciones: number;
  montoNeto: number;                   // Calculado en DB
  metodoPago: string | null;
  referenciaPago: string | null;
  notas: string | null;
}
```

---

## ENUMS

```typescript
export type Rol = 'admin' | 'recepcionista' | 'terapeuta' | 'cliente';

export type EstadoTurno = 'pendiente' | 'confirmado' | 'cancelado' | 'atendido' | 'ausente' | 'reprogramado';

export type EstadoPago = 'pendiente_adelanto' | 'adelanto_pagado' | 'pagado_completo' | 'cancelado' | 'reembolsado';

export type TipoDescuento = 'porcentaje' | 'fijo';

export type TipoServicio = 'principal' | 'addon';

export type DiaSemana = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado' | 'domingo';

export type AlcancePromocion = 'todos' | 'servicio_especifico' | 'categoria' | 'cumpleanos';

export type MetodoPago = 'efectivo' | 'transferencia' | 'tarjeta_debito' | 'tarjeta_credito' | 'mercadopago' | 'otro';
```

---

## MAPEO DE COLORES POR ESTADO

```typescript
// Usar estos colores para badges y chips de estado

export const ESTADO_TURNO_COLORS: Record<EstadoTurno, string> = {
  pendiente:     'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmado:    'bg-blue-100 text-blue-800 border-blue-200',
  atendido:      'bg-green-100 text-green-800 border-green-200',
  cancelado:     'bg-red-100 text-red-800 border-red-200',
  ausente:       'bg-gray-100 text-gray-800 border-gray-200',
  reprogramado:  'bg-purple-100 text-purple-800 border-purple-200',
};

export const ESTADO_PAGO_COLORS: Record<EstadoPago, string> = {
  pendiente_adelanto: 'bg-yellow-100 text-yellow-800',
  adelanto_pagado:    'bg-blue-100 text-blue-800',
  pagado_completo:    'bg-green-100 text-green-800',
  cancelado:          'bg-gray-100 text-gray-800',
  reembolsado:        'bg-purple-100 text-purple-800',
};

export const ESTADO_TURNO_LABELS: Record<EstadoTurno, string> = {
  pendiente:    'Pendiente',
  confirmado:   'Confirmado',
  atendido:     'Atendido',
  cancelado:    'Cancelado',
  ausente:      'Ausente',
  reprogramado: 'Reprogramado',
};

export const ESTADO_PAGO_LABELS: Record<EstadoPago, string> = {
  pendiente_adelanto: 'Pendiente de adelanto',
  adelanto_pagado:    'Adelanto pagado',
  pagado_completo:    'Pagado completo',
  cancelado:          'Cancelado',
  reembolsado:        'Reembolsado',
};
```

---

## COMPONENTES POR PANTALLA

### 1. Login (`/login`)
- Formulario reactivo: username + password
- Validación: ambos requeridos
- On success: guardar tokens en localStorage, redirigir a /dashboard
- On error: mostrar mensaje de error
- Link a "Olvidé mi contraseña" (opcional)

### 2. Dashboard Layout (envoltura de todas las páginas)
- **Sidebar**: Logo + menú navegación con íconos, item activo resaltado
  - Home (todos)
  - Agenda (admin, recepcionista)
  - Clientes (admin, recepcionista)
  - Servicios (admin)
  - Personal (admin)
  - Promociones (admin)
  - Historiales (admin, recepcionista, terapeuta)
  - Disponibilidad (admin)
  - Pagos Empleados (admin)
- **Header**: Búsqueda global (opcional), notificaciones, avatar usuario, dropdown con "Perfil" y "Cerrar sesión"
- **Contenido**: `<router-outlet />` para páginas hijas

### 3. Home (`/dashboard/home`) - Dashboard Analítico
- **Widgets superiores (4 cards)**:
  - Turnos hoy (cantidad + variación)
  - Ingresos hoy ($ + variación)
  - Pendientes de cobro ($)
  - Tasa de ocupación (%)
- **Gráfico de torta/torta**: Distribución de turnos por estado (ApexCharts `donut`)
- **Gráfico de barras**: Ingresos últimos 7/30 días (ApexCharts `bar`)
- **Tabla resumen**: Top 5 servicios más reservados
- **Tabla resumen**: Top 5 empleados por rendimiento
- **Consumir**: `GET /reports/dashboard` (un solo endpoint)

### 4. Agenda (`/dashboard/home/agenda`) - Pantalla principal operativa
- **Pestañas**: Activos (pendiente/confirmado) | Atendidos | Cancelados/Ausentes
- **Barra superior**:
  - Buscador global (input con debounce 300ms): busca por cliente, empleado, servicio
  - Filtro por fecha (date input)
  - Filtro por empleado (select)
  - Botón "+ Nuevo Turno"
- **Tabla paginada**: Columnas: Fecha, Hora, Cliente, Empleado, Servicios (tags), Monto, Estado (badge), Acciones (dropdown)
- **Paginación server-side**: controles de página, selector de límite (7, 10, 15, 25)
- **Acciones por fila** (popover/dropdown): Ver detalle, Confirmar, Atender, Reprogramar, Cancelar, Registrar Adelanto, Registrar Pago Final, Reembolsar (según estado)
- **Modal TurnoForm**: Crear nuevo turno (ver abajo)
- **Modal PagoForm**: Registrar adelanto o pago final (ver abajo)
- **Modal Confirmación**: Para cancelar, reembolsar, etc.

### 5. TurnoForm (Modal / Slide-over)
- **Select cliente**: Buscador autocomplete (debounce 300ms) → `GET /clientes?search=X&rol=cliente`
- **Select empleado**: Filtrado por disponibilidad → `GET /empleados/disponibles?fecha=&servicioIds=`
  - Mostrar indicador verde/rojo de disponibilidad
  - Mostrar especialidad
- **Buscador de servicios** (multi-select con tags):
  - Input con autocomplete (debounce 200ms) → `GET /servicios?search=X&activo=true&tipo=principal`
  - Al seleccionar un servicio principal, ofrecer add-ons → `GET /servicios/addons/:parentId`
  - Cada servicio seleccionado se muestra como tag removible
  - Si se selecciona un add-on, validar que su padre también esté seleccionado
- **Resumen dinámico** (computed signal):
  - Precio total: `sum(servicios.precio)`
  - Duración total: `sum(servicios.duracion)`
  - Hora de finalización estimada: `hora + duración`
- **Date picker**: Fecha (no pasada)
- **Time picker**: Hora (HH:MM)
- **Textarea**: Notas del turno (opcional)
- **Validación antes de enviar**:
  - Cliente requerido
  - Empleado requerido
  - Al menos 1 servicio
  - Fecha no pasada
  - El empleado puede hacer TODOS los servicios (el backend valida también)
- **On submit**: `POST /turnos` → si 201, cerrar modal, toast éxito, refrescar agenda

### 6. PagoForm (Modal)
- **Mostrar**: Monto total, Monto adelantado, Monto pendiente
- **Modo adelanto**:
  - Input: monto ($)
  - Select: método de pago
  - Validación: monto <= pendiente, monto > 0
  - `POST /cobros/:id/registrar-adelanto`
- **Modo pago final**:
  - Mostrar pendiente actual
  - Select: método de pago
  - `POST /cobros/:id/registrar-pago-final`
- **Modo descuento**:
  - Input: código de promoción
  - Botón "Validar" → `GET /promociones/validar?codigo=X`
  - Mostrar descuento calculado, nuevo total
  - Botón "Aplicar" → `POST /cobros/:id/aplicar-descuento`
- **Modo reembolso**:
  - Mostrar monto a reembolsar
  - Botón confirmación
  - `POST /cobros/:id/reembolsar`

### 7. Servicios (`/dashboard/servicios`)
- **Tabs o filtro**: Todos | Principales | Add-ons
- **Filtro por categoría** (sidebar o dropdown)
- **Tabla paginada**: Nombre, Categoría, Tipo (badge), Duración, Precio, Activo (toggle), Acciones
- **Botón "+ Nuevo Servicio"**
- **Modal ServicioForm**:
  - Select tipo: Principal | Add-on
  - Si es Add-on → Select de servicio padre (requerido): `GET /servicios/principales`
  - Si es Principal → campo padre oculto
  - Nombre, Descripción, Categoría (select), Duración (min), Precio ($), Imagen URL (opcional), Activo (toggle)
- **Edición y Soft-delete**

### 8. Personal (`/dashboard/personal`)
- **Tabla paginada**: Nombre, Email, Especialidad, Rol (badge), Servicios (tags), Activo (toggle), Acciones
- **Botón "+ Nuevo Empleado"**
- **Modal EmpleadoForm**:
  - Sección Usuario: Nombre, Email, Username, Password, Teléfono, Rol (select: terapeuta/recepcionista)
  - Sección Empleado: Especialidad (select de catálogo), Activo (toggle)
  - Sección Servicios: Lista de checkboxes con todos los servicios activos agrupados por categoría
  - Validación: al menos 1 servicio seleccionado
  - `POST /empleados` (creación atómica)

### 9. Clientes (`/dashboard/clientes`)
- **Tabla paginada**: Nombre, Email, Teléfono, Última visita, Total visitas, Acciones
- **Buscador**: por nombre, email, teléfono
- **Botón "+ Nuevo Cliente"** (opcional: también se puede crear desde el registro)
- **Modal ClienteForm**:
  - Datos básicos: Nombre, Email, Teléfono
  - Datos extendidos: Dirección, Ocupación, Cómo nos conoció, Alergias, Notas internas
- **Click en cliente**: Ver historial de turnos, historial clínico

### 10. Promociones (`/dashboard/promociones`)
- **Tabla paginada**: Título, Código, Tipo descuento, Valor, Vigencia, Aplica a, Activo, Acciones
- **Validación visual**: Promociones vencidas en gris/rojo
- **Botón "+ Nueva Promoción"**
- **Modal PromocionForm**:
  - Título, Descripción, Código (único), Imagen URL
  - Tipo descuento: Select (porcentaje/fijo) + input valor
  - Aplica a: Select (todos/servicio_específico/categoria/cumpleaños)
    - Si "servicio_específico": mostrar select de servicio
    - Si "categoria": mostrar select de categoría
    - Si "todos" o "cumpleaños": ocultar selects adicionales
  - Fechas: inicio y fin
  - Activo: toggle
- **Acciones**: Activar/Desactivar, Editar, Eliminar (soft)

### 11. Historiales Clínicos (`/dashboard/historiales`)
- **Buscador de cliente** (autocomplete) → carga el historial de ese cliente
- **Tabla paginada**: Fecha, Turno asociado (link), Diagnóstico (truncado), Tratamiento (truncado), Acciones
- **Botón "+ Nuevo Registro"**
- **Modal HistorialForm**:
  - Cliente (pre-seleccionado del buscador)
  - Turno asociado (select opcional, solo turnos atendidos del cliente)
  - Fecha, Diagnóstico (textarea), Tratamiento (textarea), Notas (textarea)
  - Adjuntar archivo (opcional, futuro S3)

### 12. Disponibilidad (`/dashboard/disponibilidad`)
- **Select empleado** (dropdown)
- **Vista semanal**: 7 columnas (lunes a domingo) con bloques de horario
- **Agregar bloque**: Modal con día, hora inicio, hora fin
- **Configuración rápida**: Formulario para setear toda la semana de una vez
  - Checkboxes de días + hora inicio/fin para cada día o global
- **Eliminar/Editar bloques existentes**

### 13. Pagos Empleados (`/dashboard/pagos-empleados`)
- **Filtro por empleado** (select)
- **Tabla paginada**: Empleado, Fecha pago, Período, Bruto, Deducciones, Neto, Método, Acciones
- **Botón "+ Nuevo Pago"**
- **Modal PagoEmpleadoForm**:
  - Empleado (select)
  - Período: fecha inicio y fin
  - Fecha de pago
  - Monto bruto, Deducciones
  - Método de pago, Referencia
  - Monto neto: calculado automáticamente (bruto - deducciones)
  - Notas (opcional)

---

## SERVICIO BASE API

```typescript
// base-api.service.ts
// Todos los servicios HTTP extienden de este servicio base.
// Maneja:
// - URL base desde environment
// - Headers de autenticación (delegado al interceptor)
// - Paginación: convierte page/limit/filtros a HttpParams
// - Manejo de errores estandarizado
// - Tipado genérico <T>

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  protected baseUrl = environment.apiUrl;

  constructor(protected http: HttpClient) {}

  protected buildParams(filters: Record<string, any>): HttpParams {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, String(value));
      }
    });
    return params;
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    // Manejo centralizado de errores
    // 401 -> intentar refresh token
    // Otros -> mostrar toast
    return throwError(() => error);
  }
}
```

---

## INTERCEPTORES

### AuthInterceptor
```
- Recupera accessToken de localStorage
- Adjunta header: Authorization: Bearer <token>
- Si recibe 401:
  1. Intenta POST /auth/refresh con refreshToken
  2. Si obtiene nuevo token, reintenta request original
  3. Si falla, limpia localStorage y redirige a /login
```

### ErrorInterceptor
```
- Captura errores HTTP
- 400: muestra mensaje de validación del backend
- 401: redirige a login
- 403: muestra "No tenés permisos para esta acción"
- 404: muestra "Recurso no encontrado"
- 409: muestra mensaje de conflicto (ej. email duplicado)
- 500: muestra "Error interno del servidor"
```

---

## GUARDS

### AuthGuard (`canActivate`)
```
- Verifica que exista accessToken en localStorage
- Si no existe: redirige a /login
- Si existe: permite navegación
- También verifica expiración del token (decode JWT, check exp)
```

### RoleGuard (`canActivate` con data)
```
- Uso: canActivate: [roleGuard(['admin', 'recepcionista'])]
- Obtiene el rol del usuario del token decodificado o del AuthService
- Verifica que el rol esté en la lista permitida
- Si no: redirige a /dashboard/home con mensaje de acceso denegado
```

---

## FLUJO DE AUTENTICACIÓN

```
1. Usuario ingresa a la app → AuthGuard verifica token → si no hay, redirige a /login
2. Usuario completa login form → POST /auth/login
3. Backend responde { accessToken, refreshToken, user }
4. Frontend guarda tokens en localStorage
5. AuthService.currentUser signal se actualiza con los datos del usuario
6. Router navega a /dashboard/home
7. AuthInterceptor adjunta el token en cada request subsiguiente
8. Si el token expira (401), el interceptor intenta refresh automático
9. Cerrar sesión: limpia localStorage, redirige a /login
```

---

## ESTADO GLOBAL CON SIGNALS

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly userRole = computed(() => this.currentUserSignal()?.rol ?? null);

  // Métodos: login(), register(), refreshToken(), logout(), loadUserFromStorage()
}
```

---

## CONFIGURACIÓN DE TAILWIND CSS

```css
/* styles.css */
@import "tailwindcss";

/* Tema personalizado del spa */
@theme {
  --color-spa-primary: #8B5CF6;
  --color-spa-secondary: #EC4899;
  --color-spa-accent: #F59E0B;
  --color-spa-dark: #1E293B;
  --color-spa-light: #F8FAFC;
}

/* Estilos base para formularios */
.input-spa {
  @apply w-full rounded-lg border border-gray-300 px-4 py-2.5
         focus:border-spa-primary focus:ring-2 focus:ring-spa-primary/20
         transition-all duration-200;
}

.btn-spa-primary {
  @apply bg-spa-primary text-white px-6 py-2.5 rounded-lg font-medium
         hover:bg-spa-primary/90 transition-colors duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-spa-danger {
  @apply bg-red-500 text-white px-6 py-2.5 rounded-lg font-medium
         hover:bg-red-600 transition-colors duration-200;
}
```

---

## DEPENDENCIAS FRONTEND (package.json)

```json
{
  "name": "spa-grace-frontend",
  "version": "2.0.0",
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development"
  },
  "dependencies": {
    "@angular/common": "^22.0.0",
    "@angular/core": "^22.0.0",
    "@angular/forms": "^22.0.0",
    "@angular/platform-browser": "^22.0.0",
    "@angular/router": "^22.0.0",
    "apexcharts": "^6.5.0",
    "ng-apexcharts": "^2.4.0",
    "rxjs": "~7.8.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^22.0.0",
    "@angular/cli": "^22.0.0",
    "@angular/compiler-cli": "^22.0.0",
    "@tailwindcss/cli": "^4.0.0",
    "tailwindcss": "^4.3.0",
    "typescript": "~7.0.0"
  }
}
```

---

## PANTALLAS A IMPLEMENTAR (RESUMEN VISUAL)

| # | Ruta | Pantalla | Roles |
|---|------|----------|-------|
| 1 | `/login` | Login | Público |
| 2 | `/dashboard/home` | Dashboard analítico | Todos |
| 3 | `/dashboard/agenda` | Agenda de turnos | admin, recepcionista |
| 4 | `/dashboard/clientes` | Gestión de clientes | admin, recepcionista |
| 5 | `/dashboard/servicios` | Catálogo de servicios | admin |
| 6 | `/dashboard/personal` | Gestión de empleados | admin |
| 7 | `/dashboard/promociones` | Promociones y descuentos | admin |
| 8 | `/dashboard/historiales` | Historiales clínicos | admin, recepcionista, terapeuta |
| 9 | `/dashboard/disponibilidad` | Horarios de empleados | admin |
| 10 | `/dashboard/pagos-empleados` | Nómina y pagos | admin |

---

## REGLAS DE NEGOCIO PARA EL FRONTEND

1. **No permitir agendar en el pasado**: Date picker con `min = today`.
2. **Validación temprana de servicios**: Si se selecciona un empleado, filtrar servicios que NO puede realizar (mostrarlos deshabilitados).
3. **Cálculo dinámico del paquete**: Usar `computed()` para precio y duración total. Reflejar cambios instantáneamente al agregar/quitar servicios.
4. **Confirmación para acciones destructivas**: Cancelar turno, eliminar servicio, reembolsar → modal de confirmación.
5. **Transiciones de estado**: Mostrar solo las acciones válidas según el estado actual del turno/cobro.
6. **Paginación server-side**: No cargar todos los registros. Usar parámetros `page` y `limit` en todas las queries.
7. **Búsqueda con debounce**: 300ms para campos de búsqueda de texto libre.
8. **Máscaras de input**: Teléfono con formato, precios con 2 decimales, fechas con datepicker.
9. **Toasts de notificación**: Éxito (verde), Error (rojo), Warning (amarillo), Info (azul). Auto-dismiss 4 segundos.

---

## NOTAS PARA EL DESARROLLADOR FRONTEND

1. **Arrancar con el layout dashboard** primero, con rutas placeholder. Luego implementar pantalla por pantalla.
2. **AuthService y AuthInterceptor** son críticos y deben funcionar desde el día 1.
3. **BaseApiService** con paginación genérica ahorra muchísimo código repetido.
4. **Tailwind v4** usa la directiva `@import "tailwindcss"` (no las viejas `@tailwind base/components/utilities`).
5. **Angular 22** usa Standalone Components por defecto. No crear NgModules. Usar `imports` en el decorador del componente.
6. **Signals sobre RxJS**: Para estado de UI (currentUser, filtros, paginación). RxJS para HTTP streams (switchMap, debounceTime en buscadores).
7. **Los servicios NO deben usar providedIn: 'root'**, excepto AuthService y servicios cross-cutting. Los servicios de dominio deben ser `providedIn: 'any'` o providers en ruta.
8. **El interceptor de refresh token** debe usar una cola de requests para no disparar múltiples refreshes simultáneos.
