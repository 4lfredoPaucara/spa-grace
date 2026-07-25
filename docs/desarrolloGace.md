# Análisis y Plan de Reconstrucción Backend - Sistema SpaGrace

> **Repositorio:** GitHub | **Estrategia:** Git Flow (main/develop/feature/*) | **Tracker:** `desarrolloGace_Tracker.md`

---

## SECCIÓN 0: RESUMEN EJECUTIVO PARA AGENTE FRONTEND

> **Para el agente de frontend:** Este documento detalla TODOS los endpoints, contratos de API, DTOs de entrada/salida, reglas de negocio y comportamientos esperados del backend. El frontend debe implementarse como una SPA Angular (v17+) con Standalone Components, Tailwind CSS, Reactive Forms, Signals y NgApexcharts. Consultá la **SECCIÓN 5** para la API completa y la **SECCIÓN 6** para las reglas de validación que deben replicarse en el cliente.

---

## SECCIÓN 1: ARQUITECTURA GLOBAL

### 1.1 Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPA FRONTEND (Angular 17+)                    │
│  Standalone Components | Reactive Forms | Signals | Tailwind    │
│  Auth Interceptor | Guards | Services HTTP | ApexCharts         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP REST (JSON)
                              │ Authorization: Bearer <JWT>
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   API GATEWAY / BACKEND (NestJS 10+)             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐       │
│  │  Auth    │ │  Guard   │ │  Pipe    │ │  Interceptor │       │
│  │  Module  │ │  (JWT +  │ │  (DTO    │ │  (Logging +  │       │
│  │  (JWT +  │ │  Roles)  │ │  Valid.)│ │  Transform)  │       │
│  │  Bcrypt) │ └──────────┘ └──────────┘ └──────────────┘       │
│  └──────────┘                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   BUSINESS MODULES                        │   │
│  │  Users | Empleados | Servicios | Turnos | Cobros          │   │
│  │  Disponibilidad | Historiales | Promociones | Pagos       │   │
│  │  Reports (Analytics)                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   DATA LAYER                              │   │
│  │  TypeORM Repositories | Query Builder | Transactions      │   │
│  │  Migrations | Seeders | Entity Validators                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ TypeORM Driver (mysql2)
                              │
┌─────────────────────────────────────────────────────────────────┐
│                   DATABASE (MySQL 8.x / MariaDB 10.6+)           │
│  Stored Generated Columns | Foreign Keys | Cascade Deletes      │
│  Composite Indexes | Pivot Tables (M:N) | Views (Reports)        │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico (Backend)

| Categoría | Tecnología | Versión | Propósito |
|-----------|-----------|---------|-----------|
| Runtime | Node.js | 20 LTS | Entorno de ejecución |
| Framework | NestJS | 10+ | Framework progresivo backend |
| Lenguaje | TypeScript | 5.x | Tipado estático |
| ORM | TypeORM | 0.3.x | Mapeo objeto-relacional |
| Base de Datos | MySQL / MariaDB | 8.0+ / 10.6+ | Motor relacional |
| Auth | Passport-JWT + Bcrypt | - | Autenticación y hashing |
| Validación | class-validator + class-transformer | - | Validación DTOs |
| Documentación | @nestjs/swagger | - | OpenAPI/Swagger |
| Configuración | @nestjs/config | - | Variables de entorno |
| Testeo | Jest + Supertest | - | Pruebas unitarias y e2e |

---

## SECCIÓN 2: ANÁLISIS DE LA ARQUITECTURA ACTUAL

### 2.1 Lo que Funciona Bien (Conservar)

- **Separación Frontend/Backend**: Comunicación exclusiva vía REST + JWT. Correcto.
- **Patrón Repositorio**: TypeORM abstrae el acceso a datos. Correcto.
- **DTO Pattern**: Desacoplamiento entrada/entidad. Correcto.
- **Guard Pattern**: JWT + Roles en cascada. Correcto.
- **Columnas Calculadas en DB**: `monto_pendiente` y `monto_neto` como STORED GENERATED. Excelente decisión, libera al servidor.
- **Relación M:N en Turnos-Servicios**: Permite paquetes de servicios. Correcto.
- **Creación Atómica Usuario+Empleado**: Un solo endpoint evita huérfanos. Correcto.
- **Self-referencia en Servicios**: Jerarquía Principal/Add-on. Correcto.

### 2.2 Redundancias y Problemas Detectados

| # | Problema | Impacto | Gravedad |
|---|----------|---------|----------|
| 1 | `precio_servicio_base` en turnos es redundante con la suma de servicios del paquete | Inconsistencia si cambian precios de servicios | ALTA |
| 2 | Tabla `usuarios` mezcla clientes, empleados y admins. Debería separarse dominio de clientes | Difícil escalar atributos específicos por rol | MEDIA |
| 3 | `especialidad` en empleados es texto libre sin catálogo ni validación | Errores de tipeo, difícil filtrar/buscar | MEDIA |
| 4 | Sin timestamps de auditoría (`created_at`, `updated_at`) en la mayoría de tablas | Sin trazabilidad de cambios | ALTA |
| 5 | Sin soft-delete en entidades críticas (servicios, empleados, promociones) | Pérdida de integridad referencial histórica | MEDIA |
| 6 | El módulo `reports` solo tiene un endpoint (`summary-by-status`) | Muy limitado para un dashboard analítico | MEDIA |
| 7 | La paginación es solo cliente; la API devuelve todos los registros | Problemas de rendimiento con muchos datos | ALTA |
| 8 | Sin manejo de transacciones en operaciones multi-entidad (creación turno+cobro) | Riesgo de inconsistencia | ALTA |
| 9 | Sin índices definidos en la documentación más allá de PKs y FKs | Bajo rendimiento en búsquedas frecuentes | MEDIA |
| 10 | Faltan campos en la entidad User documentada vs el DDL SQL (`fecha_nacimiento`, `sexo`) | Documentación desactualizada | BAJA |
| 11 | No hay endpoint para subida de archivos en historiales clínicos | Funcionalidad declarada pero no implementada | BAJA |
| 12 | Las promociones no tienen validación de fecha de vigencia en la lógica de aplicación | Descuentos vencidos podrían aplicarse | ALTA |
| 13 | No hay detección de conflictos de horario en turnos | Doble booking posible | ALTA |

### 2.3 Dependencias Entre Módulos

```
auth ──────► users ──────► empleados ──────► servicios
  │              │               │                 │
  │              │               │                 │
  └──────────────┴───────────────┴─────────────────┘
                        │
                        ▼
                     turnos ──────► cobros ──────► promociones
                        │
                        ▼
              ┌─────────────────────────┐
              │ disponibilidad           │
              │ historiales (clientes)   │
              │ pagos-empleados          │
              │ reports (todos)          │
              └─────────────────────────┘
```

---

## SECCIÓN 3: PLAN DE RECONSTRUCCIÓN MEJORADO (BACKEND)

### 3.1 Nueva Estructura de Carpetas Propuesta

```
spa-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts            # Health check
│   │
│   ├── config/                       # Configuración centralizada
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── app.config.ts
│   │   └── cors.config.ts
│   │
│   ├── common/                       # Código compartido
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors/
│   │   │   ├── log.interceptor.ts
│   │   │   ├── transform.interceptor.ts
│   │   │   └── audit.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── dto/
│   │   │   └── pagination.dto.ts
│   │   ├── enums/
│   │   │   ├── roles.enum.ts
│   │   │   ├── estado-turno.enum.ts
│   │   │   ├── estado-pago.enum.ts
│   │   │   ├── tipo-descuento.enum.ts
│   │   │   ├── metodo-pago.enum.ts
│   │   │   └── dia-semana.enum.ts
│   │   ├── interfaces/
│   │   │   ├── paginated-result.interface.ts
│   │   │   └── api-response.interface.ts
│   │   └── constants/
│   │       └── index.ts
│   │
│   ├── database/                     # Capa de datos
│   │   ├── migrations/              # Migraciones generadas
│   │   ├── seeders/                 # Datos iniciales
│   │   │   ├── admin.seeder.ts
│   │   │   ├── servicios.seeder.ts
│   │   │   └── roles.seeder.ts
│   │   └── views/                   # Vistas SQL para reportes
│   │       └── reportes.view.sql
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       ├── register.dto.ts
│   │   │       ├── refresh-token.dto.ts
│   │   │       └── change-password.dto.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── query-user.dto.ts
│   │   │
│   │   ├── clientes/                 # NUEVO: Separado de users
│   │   │   ├── clientes.module.ts
│   │   │   ├── clientes.controller.ts
│   │   │   ├── clientes.service.ts
│   │   │   ├── entities/
│   │   │   │   └── cliente.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-cliente.dto.ts
│   │   │       └── update-cliente.dto.ts
│   │   │
│   │   ├── empleados/
│   │   │   ├── empleados.module.ts
│   │   │   ├── empleados.controller.ts
│   │   │   ├── empleados.service.ts
│   │   │   ├── entities/
│   │   │   │   └── empleado.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-empleado.dto.ts
│   │   │       ├── create-empleado-with-user.dto.ts
│   │   │       ├── update-empleado.dto.ts
│   │   │       └── assign-servicio.dto.ts
│   │   │
│   │   ├── servicios/
│   │   │   ├── servicios.module.ts
│   │   │   ├── servicios.controller.ts
│   │   │   ├── servicios.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── servicio.entity.ts
│   │   │   │   └── categoria-servicio.entity.ts  # NUEVO
│   │   │   └── dto/
│   │   │       ├── create-servicio.dto.ts
│   │   │       ├── update-servicio.dto.ts
│   │   │       └── query-servicio.dto.ts
│   │   │
│   │   ├── turnos/
│   │   │   ├── turnos.module.ts
│   │   │   ├── turnos.controller.ts
│   │   │   ├── turnos.service.ts
│   │   │   ├── entities/
│   │   │   │   └── turno.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-turno.dto.ts
│   │   │       ├── update-turno.dto.ts
│   │   │       └── query-turno.dto.ts
│   │   │
│   │   ├── cobros/
│   │   │   ├── cobros.module.ts
│   │   │   ├── cobros.controller.ts
│   │   │   ├── cobros.service.ts
│   │   │   ├── entities/
│   │   │   │   └── cobro.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-cobro.dto.ts
│   │   │       ├── update-cobro.dto.ts
│   │   │       ├── aplicar-descuento.dto.ts
│   │   │       └── procesar-pago.dto.ts
│   │   │
│   │   ├── disponibilidad/
│   │   │   ├── disponibilidad.module.ts
│   │   │   ├── disponibilidad.controller.ts
│   │   │   ├── disponibilidad.service.ts
│   │   │   ├── entities/
│   │   │   │   └── disponibilidad.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-disponibilidad.dto.ts
│   │   │       └── update-disponibilidad.dto.ts
│   │   │
│   │   ├── historiales/
│   │   │   ├── historiales.module.ts
│   │   │   ├── historiales.controller.ts
│   │   │   ├── historiales.service.ts
│   │   │   ├── entities/
│   │   │   │   └── historial.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-historial.dto.ts
│   │   │       └── update-historial.dto.ts
│   │   │
│   │   ├── promociones/
│   │   │   ├── promociones.module.ts
│   │   │   ├── promociones.controller.ts
│   │   │   ├── promociones.service.ts
│   │   │   ├── entities/
│   │   │   │   └── promocion.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-promocion.dto.ts
│   │   │       └── update-promocion.dto.ts
│   │   │
│   │   ├── pagos-empleados/
│   │   │   ├── pagos-empleados.module.ts
│   │   │   ├── pagos-empleados.controller.ts
│   │   │   ├── pagos-empleados.service.ts
│   │   │   ├── entities/
│   │   │   │   └── pago-empleado.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-pago.dto.ts
│   │   │       └── update-pago.dto.ts
│   │   │
│   │   └── reports/
│   │       ├── reports.module.ts
│   │       ├── reports.controller.ts
│   │       └── reports.service.ts
│   │
│   └── test/                         # Tests e2e
│       ├── app.e2e-spec.ts
│       ├── auth.e2e-spec.ts
│       ├── turnos.e2e-spec.ts
│       └── jest-e2e.json
│
├── .env.example
├── .env.development
├── .env.production
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
├── package.json
├── jest.config.ts
├── Dockerfile
└── docker-compose.yml
```

---

## SECCIÓN 4: MEJORAS SUSTANCIALES AL BACKEND

### 4.1 Separación de Dominio: Clientes vs Usuarios

**Problema**: La tabla `usuarios` contiene clientes, empleados, admin y recepcionistas. Esto dificulta extender atributos específicos de clientes (dirección, preferencias, historial médico detallado, ficha estética).

**Solución**: Crear tabla `clientes` con FK 1:1 a `usuarios`:

```sql
CREATE TABLE `clientes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `ocupacion` VARCHAR(100) DEFAULT NULL,
  `como_conocio` VARCHAR(100) DEFAULT NULL,
  `alergias` TEXT DEFAULT NULL,
  `notas_internas` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Impacto Frontend**: Nuevo endpoint `GET /clientes?search=&page=&limit=` y formulario de perfil de cliente con campos extendidos.

### 4.2 Tabla de Auditoría y Soft Delete

Agregar a TODAS las tablas principales:

```typescript
// Campos base que toda entidad debe tener
@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt: Date;  // Soft delete
```

TypeORM maneja `deletedAt` automáticamente con `{ softDelete: true }` en el repositorio.

### 4.3 Catálogo de Categorías de Servicios

**Nuevo**: Tabla `categorias_servicios` para agrupar servicios:

```sql
CREATE TABLE `categorias_servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT DEFAULT NULL,
  `icono` VARCHAR(50) DEFAULT NULL,
  `orden` INT DEFAULT 0,
  `activo` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Agregar campo `id_categoria` en tabla `servicios`.

**Impacto Frontend**: Sidebar o tabs con categorías (Faciales, Corporales, Masajes, etc.).

### 4.4 Catálogo de Especialidades de Empleados

**Nuevo**: Tabla `especialidades` y reemplazar campo de texto libre:

```sql
CREATE TABLE `especialidades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT DEFAULT NULL,
  `activo` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Campo `id_especialidad` en `empleados` reemplaza `especialidad`.

### 4.5 Sistema de Paginación Server-Side

TODOS los endpoints GET de listado deben aceptar parámetros de paginación:

```typescript
// common/dto/pagination.dto.ts
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  sortBy?: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';

  @IsOptional()
  search?: string;
}
```

Formato de respuesta paginada:

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Impacto Frontend**: Implementar paginación server-side con `HttpParams`. Los servicios HTTP deben enviar `page`, `limit`, `search`, `sortBy`, `sortOrder`.

### 4.6 Manejo de Transacciones

Toda operación que modifique múltiples entidades debe usar transacciones TypeORM:

```typescript
// Ejemplo en TurnosService.create()
async create(dto: CreateTurnoDto): Promise<Turno> {
  return this.dataSource.transaction(async (manager) => {
    // 1. Validar disponibilidad
    // 2. Crear turno
    // 3. Crear cobro
    // Todo dentro de la misma transacción
  });
}
```

### 4.7 Detección de Conflictos de Horario

Antes de crear un turno, el backend debe verificar:
- El empleado NO tiene otro turno en el mismo horario (considerando la duración de los servicios)
- El empleado TIENE disponibilidad para ese día y hora
- La fecha y hora no están en el pasado

### 4.8 Validación de Vigencia de Promociones

En `CobrosService.aplicarDescuento()`:
- Validar que `fecha_inicio <= hoy <= fecha_fin`
- Validar que el código no esté vencido
- Validar que `activo == true`
- Si `aplica_a == 'servicio_especifico'`, validar que el servicio del turno coincida

### 4.9 Refresh Token

Agregar soporte para refresh tokens:
- `POST /auth/refresh` recibe `refreshToken` y devuelve nuevo par de tokens
- Tabla `refresh_tokens` en BD
- El access token expira en 15min, el refresh token en 7 días
- El frontend interceptor debe manejar refresh automático al recibir 401

### 4.10 Documentación Swagger/OpenAPI

Todos los endpoints deben documentarse con decoradores `@nestjs/swagger`:

```typescript
@ApiTags('Turnos')
@Controller('turnos')
export class TurnosController {
  @Get()
  @ApiOperation({ summary: 'Listar turnos con filtros y paginación' })
  @ApiQuery({ name: 'estado', required: false, enum: EstadoTurno })
  @ApiResponse({ status: 200, type: PaginatedTurnoResponse })
  findAll(@Query() query: QueryTurnoDto) { ... }
}
```

Swagger disponible en `GET /api/docs` para que el frontend pueda consultar la documentación interactiva.

### 4.11 Módulo Reports Mejorado

Nuevos endpoints:

| Endpoint | Descripción | Datos que devuelve |
|----------|-------------|-------------------|
| `GET /reports/ingresos?periodo=mes` | Ingresos por período | `{ total, adelantos, completos, reembolsos }` |
| `GET /reports/ingresos/diario?fecha=` | Ingresos de un día | `{ fecha, total, cantidad_turnos }` |
| `GET /reports/servicios-populares?desde=&hasta=` | Servicios más reservados | `[{ servicio, cantidad, total_facturado }]` |
| `GET /reports/empleados-rendimiento?desde=&hasta=` | Rendimiento por empleado | `[{ empleado, turnos_atendidos, total_generado }]` |
| `GET /reports/clientes-frecuentes?limite=10` | Top clientes | `[{ cliente, visitas, total_gastado }]` |
| `GET /reports/ocupacion?fecha=` | Ocupación del día | `[{ empleado, horarios_ocupados, total_horas }]` |

### 4.12 Endpoint de Health Check

```
GET /health
Response: { status: 'ok', timestamp, uptime, dbConnection: 'connected' }
```

### 4.13 Variables de Entorno Mejoradas

```env
# .env.example
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spa_consultorio_db

# JWT
JWT_SECRET=clave-secreta-de-256-bits-minimo
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=otra-clave-secreta-diferente
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:4200

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Swagger
SWAGGER_ENABLED=true
```

---

## SECCIÓN 5: API CONTRACTS COMPLETOS

### 5.1 Formato de Respuesta Estándar

Toda respuesta del backend sigue esta estructura:

```json
// Éxito
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa",
  "timestamp": "2026-07-25T10:30:00.000Z"
}

// Error
{
  "success": false,
  "statusCode": 400,
  "message": "El empleado no está autorizado para realizar este servicio",
  "error": "Bad Request",
  "timestamp": "2026-07-25T10:30:00.000Z",
  "path": "/api/v1/turnos"
}

// Paginado
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### 5.2 Auth Endpoints

```
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
GET    /api/v1/auth/profile
POST   /api/v1/auth/change-password
POST   /api/v1/auth/logout
```

**POST /api/v1/auth/login**
```
Request:
{
  "username": "admin",
  "password": "Admin123!"
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": 1,
      "nombre": "Admin Principal",
      "email": "admin@spagrace.com",
      "username": "admin",
      "rol": "admin",
      "telefono": null,
      "avatarUrl": null,
      "fechaRegistro": "2026-01-01T00:00:00.000Z"
    }
  }
}

Error (401):
{
  "success": false,
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

**POST /api/v1/auth/register**
```
Request (cliente que se auto-registra):
{
  "nombre": "María García",
  "email": "maria@email.com",
  "username": "mariagarcia",
  "password": "Password123!",
  "telefono": "+5491123456789"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 15,
    "nombre": "María García",
    "email": "maria@email.com",
    "username": "mariagarcia",
    "rol": "cliente",
    "fechaRegistro": "2026-07-25T10:30:00.000Z"
  },
  "message": "Usuario registrado exitosamente"
}

Error (409):
{
  "success": false,
  "statusCode": 409,
  "message": "El email o username ya está en uso"
}
```

**POST /api/v1/auth/refresh**
```
Request:
{
  "refreshToken": "eyJhbGciOi..."
}

Response (200):
{
  "success": true,
  "data": {
    "accessToken": "nuevo_access_token...",
    "refreshToken": "nuevo_refresh_token..."
  }
}
```

### 5.3 Users Endpoints

```
GET    /api/v1/users              # Listado paginado con filtros
GET    /api/v1/users/:id          # Detalle
PATCH  /api/v1/users/:id          # Actualizar
DELETE /api/v1/users/:id          # Soft delete
GET    /api/v1/users/me           # Perfil del usuario autenticado
PATCH  /api/v1/users/me           # Actualizar perfil propio
```

**GET /api/v1/users?page=1&limit=10&rol=cliente&search=maria**
```
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 15,
      "nombre": "María García",
      "email": "maria@email.com",
      "username": "mariagarcia",
      "rol": "cliente",
      "telefono": "+5491123456789",
      "fechaRegistro": "2026-07-25T10:30:00.000Z",
      "cliente": { ... }       // Datos de la tabla clientes si rol=cliente
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### 5.4 Clientes Endpoints (NUEVO)

```
GET    /api/v1/clientes                     # Listado paginado con búsqueda
GET    /api/v1/clientes/:id                 # Detalle con historial y turnos
POST   /api/v1/clientes                     # Crear con datos de usuario
PATCH  /api/v1/clientes/:id                 # Actualizar ficha
GET    /api/v1/clientes/:id/historial       # Historial clínico del cliente
GET    /api/v1/clientes/:id/turnos          # Turnos del cliente
```

**POST /api/v1/clientes**
```
Request:
{
  "usuario": {
    "nombre": "Laura Martínez",
    "email": "laura@email.com",
    "phone": "+5491123456789"
  },
  "direccion": "Av. Corrientes 1234, CABA",
  "ocupacion": "Docente",
  "comoConocio": "instagram",
  "alergias": "Ninguna conocida",
  "notasInternas": "Cliente VIP - Prefiere turnos matutinos"
}

Response (201): { success: true, data: { cliente... } }
```

### 5.5 Empleados Endpoints

```
GET    /api/v1/empleados                    # Listado paginado
GET    /api/v1/empleados/:id                # Detalle con servicios asignados
POST   /api/v1/empleados                    # Crear empleado con usuario (atómico)
PATCH  /api/v1/empleados/:id                # Actualizar perfil
DELETE /api/v1/empleados/:id                # Soft delete (desactiva)
POST   /api/v1/empleados/:id/servicios      # Asignar servicio
DELETE /api/v1/empleados/:id/servicios/:servicioId  # Remover servicio
GET    /api/v1/empleados/:id/disponibilidad # Horarios del empleado
GET    /api/v1/empleados/:id/turnos         # Turnos asignados
GET    /api/v1/empleados/disponibles?fecha=&servicioId=  # Empleados disponibles
```

**POST /api/v1/empleados (Creación atómica Usuario+Empleado)**
```
Request:
{
  "usuario": {
    "nombre": "Ana Gómez",
    "email": "ana@spagrace.com",
    "password": "Password123!",
    "username": "anagomez",
    "rol": "terapeuta",
    "telefono": "+5491123456790"
  },
  "idEspecialidad": 3,
  "activo": true,
  "serviciosIds": [1, 2, 5, 8]
}

Response (201):
{
  "success": true,
  "data": {
    "id": 4,
    "usuario": {
      "id": 12,
      "nombre": "Ana Gómez",
      "email": "ana@spagrace.com",
      "username": "anagomez",
      "rol": "terapeuta"
    },
    "especialidad": { "id": 3, "nombre": "Masoterapia" },
    "activo": true,
    "servicios": [
      { "id": 1, "nombre": "Masaje Descontracturante" },
      { "id": 2, "nombre": "Masaje Relajante" },
      { "id": 5, "nombre": "Drenaje Linfático" },
      { "id": 8, "nombre": "Piedras Calientes (Add-on)" }
    ]
  },
  "message": "Empleado creado exitosamente"
}
```

**GET /api/v1/empleados/disponibles?fecha=2026-08-10&hora=15:00&servicioIds=1,2**
```
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 4,
      "usuario": { "nombre": "Ana Gómez" },
      "especialidad": { "nombre": "Masoterapia" },
      "disponible": true,              // Está en su horario laboral
      "sinConflictos": true,           // No tiene otro turno en ese horario
      "serviciosCompatibles": [1, 2]   // IDs de servicios que puede realizar
    }
  ]
}
```

### 5.6 Servicios Endpoints

```
GET    /api/v1/servicios                    # Listado paginado con jerarquía
GET    /api/v1/servicios/:id                # Detalle
POST   /api/v1/servicios                    # Crear
PATCH  /api/v1/servicios/:id                # Actualizar
DELETE /api/v1/servicios/:id                # Soft delete
GET    /api/v1/servicios/categorias         # Listar categorías
GET    /api/v1/servicios/principales        # Solo servicios principales (para add-ons)
GET    /api/v1/servicios/addons/:parentId   # Add-ons de un servicio principal
```

**GET /api/v1/servicios?categoriaId=1&activo=true**
```
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Masaje Descontracturante",
      "descripcion": "Masaje terapéutico de tejido profundo...",
      "duracion": 60,
      "precio": 4500.00,
      "categoria": { "id": 1, "nombre": "Masajes", "icono": "spa" },
      "tipo": "principal",           // 'principal' | 'addon'
      "parentServicio": null,
      "addons": [
        { "id": 8, "nombre": "Piedras Calientes", "duracion": 15, "precio": 1200 },
        { "id": 9, "nombre": "Aceites Esenciales", "duracion": 0, "precio": 800 }
      ],
      "duracionTotal": 60,            // Duración base (sin add-ons)
      "precioTotal": 4500.00,         // Precio base (sin add-ons)
      "empleadosHabilitados": 3,      // Cantidad de empleados que pueden hacerlo
      "activo": true,
      "imagenUrl": "https://...",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "meta": { "total": 25, "page": 1, "limit": 10, "totalPages": 3 }
}
```

**POST /api/v1/servicios**
```
Request:
{
  "nombre": "Piedras Calientes",
  "descripcion": "Terapia con piedras volcánicas...",
  "duracion": 15,
  "precio": 1200.00,
  "idCategoria": 1,
  "tipo": "addon",                   // 'principal' | 'addon'
  "parentServicioId": 1,             // Obligatorio si tipo='addon'
  "activo": true,
  "imagenUrl": "https://..."
}

Validation:
- Si tipo='addon' -> parentServicioId REQUERIDO
- Si tipo='principal' -> parentServicioId debe ser NULL
- nombre debe ser único
- duracion >= 0 (los add-ons pueden tener duración 0 = no suma tiempo)
- precio >= 0
```

### 5.7 Turnos Endpoints

```
GET    /api/v1/turnos                       # Listado paginado con filtros
GET    /api/v1/turnos/:id                   # Detalle con servicios y cobro
POST   /api/v1/turnos                       # Crear turno (genera cobro automático)
PATCH  /api/v1/turnos/:id                   # Actualizar estado/datos
DELETE /api/v1/turnos/:id                   # Cancelar (soft)
GET    /api/v1/turnos/calendario?fecha=&empleadoId=  # Vista calendario
PATCH  /api/v1/turnos/:id/confirmar         # Confirmar turno
PATCH  /api/v1/turnos/:id/atender           # Marcar como atendido
PATCH  /api/v1/turnos/:id/reprogramar       # Cambiar fecha/hora
```

**GET /api/v1/turnos?page=1&limit=10&estado=pendiente&fecha=2026-08-10**
```
Response (200):
{
  "success": true,
  "data": [
    {
      "id": 42,
      "cliente": {
        "id": 15,
        "nombre": "María García",
        "telefono": "+5491123456789"
      },
      "empleado": {
        "id": 4,
        "nombre": "Ana Gómez",
        "especialidad": "Masoterapia"
      },
      "servicios": [
        { "id": 1, "nombre": "Masaje Descontracturante", "precio": 4500, "duracion": 60 },
        { "id": 8, "nombre": "Piedras Calientes", "precio": 1200, "duracion": 15 }
      ],
      "fecha": "2026-08-10",
      "hora": "15:00",
      "horaFin": "16:15",                   // Calculada: hora + suma duraciones
      "precioTotal": 5700.00,               // Suma de precios de servicios
      "duracionTotal": 75,                  // Suma de duraciones
      "estado": "pendiente",
      "notasTurno": "Cliente prefiere presión media",
      "cobro": {
        "id": 42,
        "montoTotal": 5700.00,
        "montoAdelanto": 0.00,
        "montoPendiente": 5700.00,
        "estadoPago": "pendiente_adelanto"
      },
      "fechaCreacion": "2026-07-25T10:30:00.000Z"
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

**POST /api/v1/turnos**
```
Request:
{
  "idCliente": 15,
  "idEmpleado": 4,
  "serviciosIds": [1, 8],            // Array de IDs de servicios
  "fecha": "2026-08-10",
  "hora": "15:00",
  "notasTurno": "Cliente prefiere presión media"
}

Validaciones automáticas del backend:
1. Cliente existe y tiene rol 'cliente'
2. Empleado existe, está activo
3. TODO servicio en serviciosIds existe y está activo
4. El empleado tiene autorización para TODOS los servicios (empleados_servicios)
5. La fecha y hora no están en el pasado
6. El empleado tiene disponibilidad en ese día y hora
7. No hay solapamiento con otro turno del empleado en ese horario
   (considerando la duración total de los servicios)
8. El empleado tiene disponibilidad para cubrir la duración total

Response (201):
{
  "success": true,
  "data": { turno_con_cobro... },
  "message": "Turno agendado exitosamente"
}

Error (400) - Empleado no autorizado:
{
  "success": false,
  "statusCode": 400,
  "message": "El empleado no está autorizado para realizar: Piedras Calientes"
}

Error (409) - Conflicto de horario:
{
  "success": false,
  "statusCode": 409,
  "message": "El empleado ya tiene un turno en ese horario (15:00 - 16:00)"
}
```

**PATCH /api/v1/turnos/:id** (Actualizar estado)
```
Request:
{
  "estado": "confirmado",            // 'pendiente'|'confirmado'|'atendido'|'cancelado'|'ausente'|'reprogramado'
  "notasTurno": "Confirmado por WhatsApp"
}

Reglas de transición de estado:
- pendiente -> confirmado | cancelado
- confirmado -> atendido | ausente | cancelado | reprogramado
- atendido -> (estado final, no se puede cambiar)
- cancelado -> (estado final, no se puede cambiar a menos que sea reprogramado)
- ausente -> (estado final)
- reprogramado -> pendiente | confirmado

Automatización:
- Al cambiar a 'cancelado' o 'ausente': Se habilita opción de reembolso si había adelanto
- Al cambiar a 'atendido': Se puede registrar pago final
```

### 5.8 Cobros Endpoints

```
GET    /api/v1/cobros                        # Listado paginado
GET    /api/v1/cobros/:id                    # Detalle
PATCH  /api/v1/cobros/:id                    # Actualizar (registrar pago)
POST   /api/v1/cobros/:id/aplicar-descuento  # Aplicar código promocional
POST   /api/v1/cobros/:id/registrar-adelanto # Registrar pago de adelanto
POST   /api/v1/cobros/:id/registrar-pago-final # Registrar pago final
POST   /api/v1/cobros/:id/reembolsar         # Procesar reembolso
```

**POST /api/v1/cobros/:id/registrar-adelanto**
```
Request:
{
  "montoAdelanto": 2000.00,
  "metodoPagoAdelanto": "transferencia",
  "notas": "Adelanto via transferencia bancaria"
}

Validaciones:
- El cobro debe estar en estado 'pendiente_adelanto'
- montoAdelanto <= montoTotal
- montoAdelanto > 0

Efecto:
- monto_adelanto se actualiza
- monto_pendiente se recalcula (DB stored column)
- estado_pago pasa a 'adelanto_pagado' (si monto_adelanto < monto_total)
  o 'pagado_completo' (si monto_adelanto == monto_total)
```

**POST /api/v1/cobros/:id/registrar-pago-final**
```
Request:
{
  "metodoPagoFinal": "efectivo",
  "notas": "Pago completo en efectivo"
}

Validaciones:
- El turno asociado debe estar en estado 'atendido' o 'confirmado'
- El cobro debe estar en estado 'adelanto_pagado'
- montoPendiente > 0

Efecto:
- monto_adelanto se iguala a monto_total (completa el pago)
- monto_pendiente -> 0 (automático por stored column)
- fecha_cobro_final = NOW()
- estado_pago -> 'pagado_completo'
```

**POST /api/v1/cobros/:id/aplicar-descuento**
```
Request:
{
  "codigoDescuento": "VERANO2026"
}

Validaciones:
- El código existe en la tabla promociones
- La promoción está activa (activo = true)
- fecha_inicio <= hoy <= fecha_fin
- Si aplica_a = 'servicio_especifico', el turno debe incluir ese servicio
- Si aplica_a = 'cumpleanos', el cliente debe cumplir años en el mes actual
- El estado del pago permite aplicar descuento (no debe estar pagado_completo/reembolsado)

Efecto:
- monto_total se reduce según tipo_descuento y valor_descuento
- monto_pendiente se recalcula
- Se registra en notas: "Descuento aplicado: VERANO2026 (20%)"

Response (200):
{
  "success": true,
  "data": {
    "montoOriginal": 5700.00,
    "descuentoAplicado": 1140.00,
    "nuevoTotal": 4560.00,
    "montoPendiente": 4560.00,
    "codigoUsado": "VERANO2026"
  }
}
```

**POST /api/v1/cobros/:id/reembolsar**
```
Validaciones:
- El turno asociado está en estado 'cancelado' o 'ausente'
- monto_adelanto > 0
- estado_pago está en 'adelanto_pagado' (no ya reembolsado)

Efecto:
- estado_pago -> 'reembolsado'
- monto_adelanto -> 0
- notas se actualiza con referencia del reembolso
- fecha_cobro_final -> NOW()

Response (200):
{
  "success": true,
  "data": {
    "montoReembolsado": 2000.00,
    "estadoPago": "reembolsado"
  },
  "message": "Adelanto reembolsado exitosamente"
}
```

### 5.9 Disponibilidad Endpoints

```
GET    /api/v1/disponibilidad?empleadoId=4
POST   /api/v1/disponibilidad                # Crear bloque de horario
PATCH  /api/v1/disponibilidad/:id            # Actualizar bloque
DELETE /api/v1/disponibilidad/:id            # Eliminar bloque
POST   /api/v1/disponibilidad/lote           # Configurar semana completa
```

**POST /api/v1/disponibilidad/lote (Configuración masiva)**
```
Request:
{
  "idEmpleado": 4,
  "horarios": [
    { "diaSemana": "lunes",    "horaInicio": "09:00", "horaFin": "18:00" },
    { "diaSemana": "martes",   "horaInicio": "09:00", "horaFin": "18:00" },
    { "diaSemana": "miercoles","horaInicio": "09:00", "horaFin": "14:00" },
    { "diaSemana": "jueves",   "horaInicio": "14:00", "horaFin": "20:00" },
    { "diaSemana": "viernes",  "horaInicio": "09:00", "horaFin": "18:00" }
  ]
}

Validación:
- No debe haber solapamiento entre bloques del mismo día
- horaInicio < horaFin
```

### 5.10 Historiales Endpoints

```
GET    /api/v1/historiales?clienteId=15&page=1&limit=10
GET    /api/v1/historiales/:id
POST   /api/v1/historiales
PATCH  /api/v1/historiales/:id
DELETE /api/v1/historiales/:id
POST   /api/v1/historiales/:id/upload         # Subir archivo adjunto
```

**POST /api/v1/historiales**
```
Request:
{
  "idCliente": 15,
  "idTurno": 42,                     // Opcional, puede no estar vinculado a turno
  "fecha": "2026-08-10",
  "diagnostico": "Contractura muscular en zona cervical y dorsal",
  "tratamiento": "Masaje descontracturante con piedras calientes. Frecuencia: 1 vez por semana por 4 semanas.",
  "notas": "El cliente refiere dolor crónico por malas posturas laborales. Buena respuesta al tratamiento."
}
```

### 5.11 Promociones Endpoints

```
GET    /api/v1/promociones?page=1&limit=10&activo=true
GET    /api/v1/promociones/:id
POST   /api/v1/promociones
PATCH  /api/v1/promociones/:id
DELETE /api/v1/promociones/:id
POST   /api/v1/promociones/:id/activar
POST   /api/v1/promociones/:id/desactivar
GET    /api/v1/promociones/validar?codigo=VERANO2026&servicioId=1
```

**POST /api/v1/promociones**
```
Request:
{
  "titulo": "Verano 2026 - 20% OFF en Masajes",
  "descripcion": "Aprovechá el verano con un 20% de descuento en todos los masajes",
  "codigoDescuento": "VERANO2026",
  "tipoDescuento": "porcentaje",
  "valorDescuento": 20.00,
  "aplicaA": "categoria",
  "idServicioAplicable": null,
  "idCategoriaAplicable": 1,         // Si aplicaA='categoria', especificar cuál
  "fechaInicio": "2026-01-01",
  "fechaFin": "2026-02-28",
  "activo": true,
  "imagenUrl": null
}
```

### 5.12 Pagos Empleados Endpoints

```
GET    /api/v1/pagos-empleados?empleadoId=4&page=1&limit=10
GET    /api/v1/pagos-empleados/:id
POST   /api/v1/pagos-empleados
PATCH  /api/v1/pagos-empleados/:id
DELETE /api/v1/pagos-empleados/:id
```

**POST /api/v1/pagos-empleados**
```
Request:
{
  "idEmpleado": 4,
  "fechaPago": "2026-08-01",
  "periodoInicio": "2026-07-01",
  "periodoFin": "2026-07-31",
  "montoBruto": 85000.00,
  "deducciones": 12750.00,
  "metodoPago": "transferencia",
  "referenciaPago": "TRF-20260801-004",
  "notas": "Sueldo julio 2026"
}

Response (201):
{
  "success": true,
  "data": {
    "montoBruto": 85000.00,
    "deducciones": 12750.00,
    "montoNeto": 72250.00             // Calculado por DB: stored column
  }
}
```

### 5.13 Reports Endpoints (MEJORADO)

```
GET    /api/v1/reports/summary-by-status         # Resumen por estado
GET    /api/v1/reports/ingresos                   # Ingresos por período
GET    /api/v1/reports/ingresos/diario            # Ingresos del día
GET    /api/v1/reports/servicios-populares        # Top servicios
GET    /api/v1/reports/empleados-rendimiento      # Rendimiento empleados
GET    /api/v1/reports/clientes-frecuentes        # Top clientes
GET    /api/v1/reports/ocupacion                  # Ocupación del día
GET    /api/v1/reports/dashboard                  # Datos consolidados dashboard
```

**GET /api/v1/reports/dashboard (Widget principal)**
```
Response (200):
{
  "success": true,
  "data": {
    "turnosPorEstado": {
      "pendiente": 12,
      "confirmado": 8,
      "atendido": 145,
      "cancelado": 5,
      "ausente": 2,
      "reprogramado": 1
    },
    "ingresosHoy": {
      "total": 28500.00,
      "cantidadTurnos": 5,
      "metodosPago": {
        "efectivo": 12000,
        "transferencia": 10500,
        "tarjeta": 6000
      }
    },
    "ingresosMes": {
      "total": 342000.00,
      "promedioDiario": 11400.00
    },
    "topServicios": [
      { "servicio": "Masaje Descontracturante", "cantidad": 45, "porcentaje": 30 },
      { "servicio": "Tratamiento Facial", "cantidad": 32, "porcentaje": 21 }
    ],
    "topEmpleados": [
      { "empleado": "Ana Gómez", "turnosAtendidos": 38, "totalGenerado": 152000 },
      { "empleado": "Carlos Ruiz", "turnosAtendidos": 35, "totalGenerado": 140000 }
    ],
    "clientesNuevosMes": 18,
    "tasaOcupacionHoy": 75
  }
}
```

### 5.14 Especialidades Endpoints (NUEVO)

```
GET    /api/v1/especialidades
POST   /api/v1/especialidades
PATCH  /api/v1/especialidades/:id
DELETE /api/v1/especialidades/:id
```

### 5.15 Categorías Servicios Endpoints (NUEVO)

```
GET    /api/v1/categorias-servicios
POST   /api/v1/categorias-servicios
PATCH  /api/v1/categorias-servicios/:id
DELETE /api/v1/categorias-servicios/:id
```

### 5.16 Health Endpoint

```
GET /api/v1/health
Response (200):
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-25T10:30:00.000Z",
    "uptime": 123456,
    "environment": "development",
    "version": "2.0.0",
    "database": "connected"
  }
}
```

---

## SECCIÓN 6: REGLAS DE NEGOCIO Y VALIDACIONES (BACKEND)

### 6.1 Validaciones para el Frontend

> **AGENTE FRONTEND**: Estas validaciones deben replicarse en Angular Reactive Forms ANTES de enviar al backend.

#### Formulario de Turno
| Campo | Validación Frontend | Validación Backend |
|-------|-------------------|-------------------|
| cliente | Requerido, debe ser del rol 'cliente' | Busca en BD, valida rol |
| empleado | Requerido, debe estar activo | Busca en BD, valida activo |
| servicios | Al menos 1, máx 10 | Valida que existan y estén activos |
| fecha | No puede ser pasada | ISO 8601, >= hoy |
| hora | Formato HH:MM, dentro del horario disponible | Valida disponibilidad del empleado |
| duración total | Calculada automáticamente con computed() | Validada contra disponibilidad |
| precio total | Calculado automáticamente con computed() | Validado contra suma de precios en BD |

#### Formulario de Empleado
| Campo | Validación |
|-------|-----------|
| nombre | Requerido, 3-100 caracteres |
| email | Requerido, formato email, único |
| password | Requerido, mín 8 caracteres, 1 mayúscula, 1 número |
| username | Requerido, 3-50 caracteres, único |
| rol | Solo 'terapeuta' o 'recepcionista' |
| especialidad | Requerida (select de catálogo) |
| servicios | Al menos 1 checkbox seleccionado |

#### Formulario de Servicio
| Campo | Validación |
|-------|-----------|
| nombre | Requerido, 2-100 caracteres, único |
| tipo | Requerido: 'principal' o 'addon' |
| parentServicioId | Requerido si tipo='addon', prohibido si tipo='principal' |
| duracion | Requerido, >= 0 (0 para add-ons que no suman tiempo) |
| precio | Requerido, >= 0 |
| categoriaId | Requerido |

### 6.2 Estados y Transiciones

#### Estados de Turno
```
       ┌──────────┐
       │pendiente │──────────────────────────────────┐
       └────┬─────┘                                  │
            │                                        │
      ┌─────▼──────┐                          ┌──────▼─────┐
      │ confirmado │                          │  cancelado │◄──┐
      └──┬────┬────┘                          └────────────┘   │
         │    │                                                 │
    ┌────▼─┐  └────────────┐                                    │
    │atendido│              │                             ┌──────┴──────┐
    └────────┘     ┌────────▼───────┐                     │ reprogramado │
                   │   ausente       │                    └──────┬───────┘
                   └────────────────┘                           │
                         │                               ┌──────▼──────┐
                         └───────────────────────────────►│  pendiente  │
                                                          └─────────────┘
```

#### Estados de Cobro
```
pendiente_adelanto -> adelanto_pagado -> pagado_completo
                   \-> cancelado
adelanto_pagado   -> reembolsado (si turno cancelado/ausente)
```

### 6.3 Jerarquía de Roles y Permisos

| Endpoint | admin | recepcionista | terapeuta | cliente |
|----------|-------|---------------|-----------|---------|
| Usuarios CRUD | Full | Solo GET | Solo GET propio | Solo GET/PATCH propio |
| Clientes CRUD | Full | Full | Solo lectura | - |
| Empleados CRUD | Full | Solo GET | - | - |
| Servicios CRUD | Full | Solo GET | Solo GET | Solo GET |
| Turnos CRUD | Full | Full | Solo GET asignados | Solo GET propios + POST |
| Cobros | Full | Full | - | Solo GET propios |
| Disponibilidad | Full | Solo GET | Solo GET propia | - |
| Historiales | Full | Full | Crear/Leer | Solo GET propios |
| Promociones | Full | Solo GET/validar | - | Solo GET/validar |
| Pagos Empleados | Full | - | Solo GET propios | - |
| Reports | Full | Full | - | - |

---

## SECCIÓN 7: ESQUEMA DE BASE DE DATOS MEJORADO

### 7.1 DDL Completo Mejorado

```sql
-- =============================================
-- SPA GRACE - Esquema de Base de Datos v2.0
-- =============================================

CREATE DATABASE IF NOT EXISTS spa_consultorio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE spa_consultorio_db;

-- ---------------------------------------------
-- 1. USUARIOS (cuentas de acceso al sistema)
-- ---------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `username` VARCHAR(50) DEFAULT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin','recepcionista','terapeuta','cliente') NOT NULL DEFAULT 'cliente',
  `telefono` VARCHAR(20) DEFAULT NULL,
  `fecha_nacimiento` DATE DEFAULT NULL,
  `sexo` ENUM('Masculino','Femenino','Otro') DEFAULT NULL,
  `avatar_url` VARCHAR(255) DEFAULT NULL,
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 2. CLIENTES (ficha extendida para rol=cliente)
-- ---------------------------------------------
CREATE TABLE `clientes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `direccion` VARCHAR(255) DEFAULT NULL,
  `ocupacion` VARCHAR(100) DEFAULT NULL,
  `como_conocio` VARCHAR(100) DEFAULT NULL,
  `alergias` TEXT DEFAULT NULL,
  `notas_internas` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 3. ESPECIALIDADES (catálogo)
-- ---------------------------------------------
CREATE TABLE `especialidades` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 4. EMPLEADOS (perfil laboral)
-- ---------------------------------------------
CREATE TABLE `empleados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `id_especialidad` INT DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 5. CATEGORÍAS DE SERVICIOS
-- ---------------------------------------------
CREATE TABLE `categorias_servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL UNIQUE,
  `descripcion` TEXT DEFAULT NULL,
  `icono` VARCHAR(50) DEFAULT NULL,
  `orden` INT NOT NULL DEFAULT 0,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 6. SERVICIOS (catálogo jerárquico)
-- ---------------------------------------------
CREATE TABLE `servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_categoria` INT DEFAULT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `duracion` INT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `tipo` ENUM('principal','addon') NOT NULL DEFAULT 'principal',
  `parent_servicio_id` INT DEFAULT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias_servicios` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 7. EMPLEADOS_SERVICIOS (pivote M:N)
-- ---------------------------------------------
CREATE TABLE `empleados_servicios` (
  `id_empleado` INT NOT NULL,
  `id_servicio` INT NOT NULL,
  PRIMARY KEY (`id_empleado`, `id_servicio`),
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 8. TURNOS (reservas)
-- ---------------------------------------------
CREATE TABLE `turnos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `duracion_total` INT NOT NULL COMMENT 'Minutos totales (suma de servicios)',
  `precio_total` DECIMAL(10,2) NOT NULL COMMENT 'Suma de precios de servicios',
  `estado` ENUM('pendiente','confirmado','cancelado','atendido','ausente','reprogramado') NOT NULL DEFAULT 'pendiente',
  `notas_turno` TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  INDEX `idx_turnos_fecha` (`fecha`),
  INDEX `idx_turnos_estado` (`estado`),
  INDEX `idx_turnos_empleado_fecha` (`id_empleado`, `fecha`),
  INDEX `idx_turnos_cliente_fecha` (`id_cliente`, `fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 9. TURNOS_SERVICIOS (pivote M:N)
-- ---------------------------------------------
CREATE TABLE `turnos_servicios` (
  `id_turno` INT NOT NULL,
  `id_servicio` INT NOT NULL,
  `precio_servicio` DECIMAL(10,2) NOT NULL COMMENT 'Precio congelado al momento del turno',
  PRIMARY KEY (`id_turno`, `id_servicio`),
  FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 10. COBROS (finanzas por turno)
-- ---------------------------------------------
CREATE TABLE `cobros` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_turno` INT NOT NULL UNIQUE,
  `monto_total` DECIMAL(10,2) NOT NULL,
  `monto_adelanto` DECIMAL(10,2) DEFAULT 0.00,
  `monto_pendiente` DECIMAL(10,2) GENERATED ALWAYS AS (`monto_total` - `monto_adelanto`) STORED,
  `metodo_pago_adelanto` VARCHAR(50) DEFAULT NULL,
  `metodo_pago_final` VARCHAR(50) DEFAULT NULL,
  `fecha_adelanto` DATETIME DEFAULT NULL,
  `fecha_cobro_final` DATETIME DEFAULT NULL,
  `estado_pago` ENUM('pendiente_adelanto','adelanto_pagado','pagado_completo','cancelado','reembolsado') NOT NULL DEFAULT 'pendiente_adelanto',
  `promocion_aplicada` VARCHAR(50) DEFAULT NULL COMMENT 'Código de promoción usado',
  `notas` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE CASCADE,
  INDEX `idx_cobros_estado` (`estado_pago`),
  INDEX `idx_cobros_fecha` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 11. DISPONIBILIDAD (horarios semanales)
-- ---------------------------------------------
CREATE TABLE `disponibilidad_empleados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_empleado` INT NOT NULL,
  `dia_semana` ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  UNIQUE KEY `uq_empleado_dia_hora` (`id_empleado`, `dia_semana`, `hora_inicio`),
  INDEX `idx_disp_empleado_dia` (`id_empleado`, `dia_semana`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 12. HISTORIALES CLÍNICOS
-- ---------------------------------------------
CREATE TABLE `historiales_clinicos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_turno` INT DEFAULT NULL,
  `fecha` DATE NOT NULL,
  `diagnostico` TEXT DEFAULT NULL,
  `tratamiento` TEXT DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  `archivo_url` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE SET NULL,
  INDEX `idx_historial_cliente` (`id_cliente`, `fecha`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 13. PAGOS EMPLEADOS (nómina)
-- ---------------------------------------------
CREATE TABLE `pagos_empleados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_empleado` INT NOT NULL,
  `fecha_pago` DATE NOT NULL,
  `periodo_inicio` DATE NOT NULL,
  `periodo_fin` DATE NOT NULL,
  `monto_bruto` DECIMAL(10,2) NOT NULL,
  `deducciones` DECIMAL(10,2) DEFAULT 0.00,
  `monto_neto` DECIMAL(10,2) GENERATED ALWAYS AS (`monto_bruto` - `deducciones`) STORED,
  `metodo_pago` VARCHAR(50) DEFAULT NULL,
  `referencia_pago` VARCHAR(100) DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  INDEX `idx_pagos_empleado_fecha` (`id_empleado`, `fecha_pago`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 14. PROMOCIONES (descuentos)
-- ---------------------------------------------
CREATE TABLE `promociones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(150) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  `fecha_inicio` DATE DEFAULT NULL,
  `fecha_fin` DATE DEFAULT NULL,
  `codigo_descuento` VARCHAR(50) DEFAULT NULL UNIQUE,
  `tipo_descuento` ENUM('porcentaje','fijo') DEFAULT NULL,
  `valor_descuento` DECIMAL(10,2) DEFAULT NULL,
  `aplica_a` ENUM('todos','servicio_especifico','categoria','cumpleanos') NOT NULL DEFAULT 'todos',
  `id_servicio_aplicable` INT DEFAULT NULL,
  `id_categoria_aplicable` INT DEFAULT NULL,
  `creado_por_id` INT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (`id_servicio_aplicable`) REFERENCES `servicios` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`id_categoria_aplicable`) REFERENCES `categorias_servicios` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`creado_por_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_promo_codigo` (`codigo_descuento`),
  INDEX `idx_promo_fechas` (`fecha_inicio`, `fecha_fin`),
  INDEX `idx_promo_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------
-- 15. REFRESH TOKENS
-- ---------------------------------------------
CREATE TABLE `refresh_tokens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL,
  `token` VARCHAR(500) NOT NULL UNIQUE,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  INDEX `idx_refresh_usuario` (`id_usuario`),
  INDEX `idx_refresh_expires` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 7.2 Cambios Clave Respecto al Esquema Original

| Cambio | Motivo |
|--------|--------|
| `precio_servicio_base` -> `precio_total` + `duracion_total` en turnos | Nombres más descriptivos. Se elimina redundancia con suma de servicios. |
| `turnos_servicios` agrega `precio_servicio` | Congela el precio al momento del turno para auditoría. Si el servicio cambia de precio después, el turno mantiene su valor histórico. |
| Tabla `clientes` nueva | Separa dominio de cliente del usuario. Permite atributos específicos sin contaminar la tabla usuarios. |
| Tabla `especialidades` nueva | Catálogo validado en lugar de texto libre. Facilita filtros y búsquedas. |
| Tabla `categorias_servicios` nueva | Agrupación lógica de servicios para UI y reportes. |
| `created_at`, `updated_at` en TODAS las tablas | Auditoría y trazabilidad. |
| `deleted_at` en tablas principales | Soft delete para no perder datos históricos. |
| Índices nuevos | Optimización de queries frecuentes (búsqueda por fecha, estado, empleado). |
| `promocion_aplicada` en cobros | Trazabilidad de qué código de descuento se usó. |
| `UNIQUE` en disponibilidad | Previene duplicados de horarios para el mismo empleado y día. |
| Tabla `refresh_tokens` | Soporte para refresh token en el flujo de auth. |

---

## SECCIÓN 8: DEPENDENCIAS COMPLETAS (BACKEND)

### 8.1 package.json Backend

```json
{
  "name": "spa-grace-backend",
  "version": "2.0.0",
  "dependencies": {
    "@nestjs/common": "^10.4.0",
    "@nestjs/config": "^3.3.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.4.0",
    "@nestjs/swagger": "^7.4.0",
    "@nestjs/throttler": "^6.2.0",
    "@nestjs/typeorm": "^10.0.2",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "helmet": "^7.1.0",
    "multer": "^1.4.5-lts.1",
    "mysql2": "^3.11.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1",
    "typeorm": "^0.3.20",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.4.0",
    "@nestjs/schematics": "^10.1.0",
    "@nestjs/testing": "^10.4.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/jest": "^29.5.12",
    "@types/multer": "^1.4.12",
    "@types/node": "^20.16.0",
    "@types/passport-jwt": "^4.0.1",
    "@types/uuid": "^10.0.0",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.0",
    "ts-node": "^10.9.2",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.5.0"
  }
}
```

---

## SECCIÓN 9: FLUJO DE DATOS E2E

### 9.1 Flujo: Agendamiento de Turno Completo

```
FRONTEND (Angular)                         BACKEND (NestJS)                     DATABASE (MySQL)
─────────────────                          ─────────────────                     ────────────────

1. Usuario abre modal
   "+ Nuevo Turno"

2. GET /clientes?search=maria&rol=cliente
   ──────────────────────────────────────► UsersController.findAll()
                                              │
                                              └──► SELECT * FROM usuarios
                                                   WHERE rol='cliente'
                                                   AND nombre LIKE '%maria%'
                                                   LIMIT 10
                                              ◄─── Resultados

3. GET /servicios?activo=true              ─────► ServiciosController.findAll()
   ◄─── Lista servicios                          │
        para buscador                            └──► SELECT * FROM servicios
                                                        WHERE activo=1
                                                        ORDER BY nombre

4. GET /empleados/disponibles?
   fecha=2026-08-10&servicioIds=1,2
   ──────────────────────────────────────► EmpleadosController.findDisponibles()
                                              │
                                              ├──► Buscar empleados con servicios
                                              │    habilitados (empleados_servicios)
                                              │
                                              ├──► Validar disponibilidad semanal
                                              │    (disponibilidad_empleados)
                                              │
                                              ├──► Verificar NO conflictos con
                                              │    turnos existentes en esa fecha/hora
                                              │
                                              └──► Retornar empleados disponibles

5. Usuario selecciona:
   - Cliente: María García (id=15)
   - Empleado: Ana Gómez (id=4)
   - Servicios: [Masaje Descontracturante, Piedras Calientes]
   - Fecha: 2026-08-10
   - Hora: 15:00

6. POST /turnos
   Body: {
     idCliente: 15,
     idEmpleado: 4,
     serviciosIds: [1, 8],
     fecha: "2026-08-10",
     hora: "15:00"
   }
   ──────────────────────────────────────► TurnosController.create()
                                              │
                                              ├──► TurnosService.create()
                                              │   │
                                              │   ├──► Validar idCliente existe y rol='cliente'
                                              │   ├──► Validar idEmpleado existe y está activo
                                              │   ├──► Validar serviciosIds existen y están activos
                                              │   ├──► Validar empleado PUEDE hacer todos los servicios
                                              │   │    (JOIN empleados_servicios)
                                              │   ├──► Validar disponibilidad día/hora
                                              │   │    (JOIN disponibilidad_empleados)
                                              │   ├──► Validar NO conflictos de horario
                                              │   │    (buscar turnos solapados)
                                              │   ├──► Calcular precio_total = SUM(precio_servicio)
                                              │   ├──► Calcular duracion_total = SUM(duracion)
                                              │   │
                                              │   ├──► BEGIN TRANSACTION
                                              │   │    ├──► INSERT INTO turnos (...)
                                              │   │    ├──► INSERT INTO turnos_servicios (...)
                                              │   │    └──► INSERT INTO cobros (monto_total=precio_total,
                                              │   │         estado_pago='pendiente_adelanto')
                                              │   │
                                              │   └──► COMMIT
                                              │
                                              └──► Retornar turno + cobro creado

7. Frontend recibe respuesta 201
   -> Muestra toast "Turno agendado exitosamente"
   -> Actualiza tabla de agenda
   -> Calcula monto_pendiente = monto_total
      (se muestra en la UI como "Pendiente: $5,700")
```

### 9.2 Flujo: Cobro de Adelanto

```
1. Recepcionista selecciona turno pendiente
   Abre modal "Registrar Adelanto"

2. POST /cobros/42/registrar-adelanto
   Body: {
     montoAdelanto: 2000,
     metodoPagoAdelanto: "transferencia",
     notas: "Adelanto via transferencia"
   }
   ──────────────────────────────────────► CobrosController.registrarAdelanto()
                                              │
                                              ├──► Validar estado_pago = 'pendiente_adelanto'
                                              ├──► Validar monto_adelanto <= monto_total
                                              ├──► Validar monto_adelanto > 0
                                              │
                                              └──► UPDATE cobros SET
                                                   monto_adelanto = 2000,
                                                   metodo_pago_adelanto = 'transferencia',
                                                   fecha_adelanto = NOW(),
                                                   estado_pago = 'adelanto_pagado',
                                                   notas = CONCAT(notas, 'Adelanto via transferencia')
                                                   WHERE id = 42

3. DB recalcula automáticamente:
   monto_pendiente = monto_total - monto_adelanto
   = 5700 - 2000 = 3700

4. Frontend actualiza:
   - Estado pago: "Adelanto Pagado"
   - Pendiente: $3,700
   - Adelanto: $2,000
```

### 9.3 Flujo: Aplicación de Descuento

```
1. POST /cobros/42/aplicar-descuento
   Body: { codigoDescuento: "VERANO2026" }
   ──────────────────────────────────────► CobrosController.aplicarDescuento()
                                              │
                                              ├──► CobrosService.aplicarDescuento()
                                              │   │
                                              │   ├──► SELECT * FROM promociones
                                              │   │    WHERE codigo_descuento = 'VERANO2026'
                                              │   │    AND activo = 1
                                              │   │    AND fecha_inicio <= CURDATE()
                                              │   │    AND fecha_fin >= CURDATE()
                                              │   │
                                              │   ├──► Validar aplicabilidad:
                                              │   │    - todos: OK siempre
                                              │   │    - servicio_especifico: ver turnos_servicios
                                              │   │    - categoria: ver categoría del servicio
                                              │   │    - cumpleanos: ver fecha_nacimiento cliente
                                              │   │
                                              │   ├──► Calcular descuento:
                                              │   │    - porcentaje: monto_total * (valor_descuento/100)
                                              │   │    - fijo: valor_descuento
                                              │   │
                                              │   ├──► UPDATE cobros SET
                                              │   │    monto_total = monto_total - descuento,
                                              │   │    promocion_aplicada = 'VERANO2026',
                                              │   │    notas = CONCAT(notas, ' | Desc. VERANO2026: -$1140')
                                              │   │
                                              │   └──► monto_pendiente se recalcula automáticamente

4. Response: { nuevoTotal: 4560, descuentoAplicado: 1140, codigo: "VERANO2026" }
```

### 9.4 Flujo: Cancelación y Reembolso

```
1. Usuario cambia estado del turno a 'cancelado'

2. PATCH /turnos/42 { estado: 'cancelado' }
   ──────────────────────────────────────► TurnosController.update()
                                              │
                                              └──► UPDATE turnos SET estado='cancelado'

3. Si el cobro tenía adelanto (estado 'adelanto_pagado'),
   el frontend muestra botón "Reembolsar Adelanto"

4. POST /cobros/42/reembolsar
   ──────────────────────────────────────► CobrosController.reembolsar()
                                              │
                                              ├──► Validar turno está cancelado o ausente
                                              ├──► Validar monto_adelanto > 0
                                              ├──► Validar estado_pago = 'adelanto_pagado'
                                              │
                                              └──► UPDATE cobros SET
                                                   monto_adelanto = 0,
                                                   estado_pago = 'reembolsado',
                                                   fecha_cobro_final = NOW(),
                                                   notas = CONCAT(notas, ' | Reembolso: $2000')
```

---

## SECCIÓN 10: RESUMEN DE DECISIONES Y MEJORAS

### 10.1 Mejoras Implementadas en esta Versión

| # | Mejora | Tipo | Prioridad |
|---|--------|------|-----------|
| 1 | Separación de dominio Clientes vs Usuarios | Arquitectura | ALTA |
| 2 | Catálogo de Especialidades y Categorías | Modelo de datos | MEDIA |
| 3 | Timestamps y Soft Delete en todas las tablas | Auditoría | ALTA |
| 4 | Paginación server-side en todos los endpoints | Rendimiento | ALTA |
| 5 | Manejo de transacciones en operaciones críticas | Integridad | ALTA |
| 6 | Detección de conflictos de horario | Regla de negocio | ALTA |
| 7 | Validación de vigencia de promociones | Seguridad | ALTA |
| 8 | Refresh Token + logout | Seguridad | MEDIA |
| 9 | Documentación Swagger/OpenAPI | DX | MEDIA |
| 10 | Módulo Reports mejorado con 7+ endpoints | Analítica | ALTA |
| 11 | Formato de respuesta estandarizado | Consistencia | MEDIA |
| 12 | Campo `precio_servicio` en tabla pivote turnos_servicios | Auditoría financiera | ALTA |
| 13 | Índices de base de datos optimizados | Rendimiento | ALTA |
| 14 | Endpoint `empleados/disponibles` con filtro inteligente | UX | ALTA |
| 15 | Rate limiting en endpoints de auth | Seguridad | MEDIA |
| 16 | Health check endpoint | Operaciones | MEDIA |

### 10.2 Redundancias Eliminadas

| Redundancia | Solución |
|-------------|----------|
| `precio_servicio_base` en turnos vs suma de servicios | Renombrado a `precio_total`, calculado de `turnos_servicios.precio_servicio` |
| Mezcla de dominios en tabla usuarios | Separación en `usuarios` + `clientes` + `empleados` |
| `especialidad` como texto libre | Catálogo `especialidades` con FK |
| Promociones sin validación de vigencia | Validación de `fecha_inicio` y `fecha_fin` en cada aplicación |
| Paginación solo cliente | Paginación server-side con metadatos |
| Reportes limitados a un endpoint | 7+ endpoints con métricas de negocio completas |
| Sin auditoría de cambios | `created_at`, `updated_at`, `deleted_at` en todas las tablas |

### 10.3 Observaciones para el Agente Frontend

1. **Estructura de servicios HTTP**: Crear un `BaseApiService` abstracto que maneje paginación, headers y manejo de errores. Cada servicio de dominio extiende de él.

2. **Manejo de tokens**: El `authInterceptor` debe:
   - Adjuntar `Authorization: Bearer <accessToken>` en cada request
   - Al recibir 401, intentar refresh con `POST /auth/refresh`
   - Si el refresh falla, redirigir a `/login`

3. **Paginación**: Todos los componentes de tabla deben aceptar y mostrar los metadatos de paginación (`meta.total`, `meta.page`, etc.) y permitir navegación.

4. **Buscador de servicios en TurnoForm**: Usar `FormControl` con `debounceTime(300)` y `switchMap` para consultar `GET /servicios?search=X&activo=true`. Si el usuario selecciona un servicio principal, ofrecer automáticamente sus add-ons llamando a `GET /servicios/addons/:parentId`.

5. **Calendario de disponibilidad**: Al seleccionar empleado y fecha en el formulario de turno, consultar `GET /empleados/disponibles` para filtrar solo los empleados disponibles. Mostrar indicador visual (verde/rojo) de disponibilidad.

6. **Dashboard**: Consumir `GET /reports/dashboard` que ya devuelve todos los datos consolidados para widgets y gráficos. Evitar llamadas múltiples a endpoints individuales de reports.

7. **Formulario de promociones**: El campo `aplicaA` debe controlar condicionalmente la visibilidad de `idServicioAplicable` o `idCategoriaAplicable`. Si `aplicaA='todos'`, ocultar ambos. Si `aplicaA='servicio_especifico'`, mostrar selector de servicio. Si `aplicaA='categoria'`, mostrar selector de categoría.

8. **Transiciones de estado**: Implementar en el frontend la misma lógica de estados y transiciones definida en la sección 6.2. Los botones de acción deben mostrarse/ocultarse según el estado actual y las transiciones válidas.

---

## SECCIÓN 11: SECUENCIA DE IMPLEMENTACIÓN RECOMENDADA

### Fase 1: Infraestructura Backend
1. Inicializar proyecto NestJS con `@nestjs/cli`
2. Configurar TypeORM con todas las entidades
3. Configurar `@nestjs/config` para variables de entorno
4. Configurar Swagger
5. Configurar ValidationPipe global con `whitelist: true`
6. Configurar filtro de excepciones HTTP estandarizado

### Fase 2: Auth + Usuarios
1. Implementar modulo Auth (JWT + Bcrypt + Refresh Token)
2. Implementar modulo Users con paginación
3. Implementar Guards (JWT + Roles)
4. Crear seeders de roles y admin inicial

### Fase 3: Catálogos Base
1. Implementar Especialidades (CRUD básico)
2. Implementar Categorías de Servicios (CRUD básico)
3. Implementar Servicios con jerarquía y validaciones de tipo
4. Implementar Clientes con ficha extendida

### Fase 4: Personal
1. Implementar Empleados con creación atómica Usuario+Empleado
2. Implementar asignación/remoción de servicios a empleados
3. Implementar endpoint `empleados/disponibles`

### Fase 5: Core Operativo (Turnos + Cobros)
1. Implementar Turnos con TODAS las validaciones
2. Implementar transacción de creación turno+cobro
3. Implementar Cobros con estados de pago, adelantos y reembolsos
4. Implementar aplicación de descuentos con promociones
5. Implementar detección de conflictos de horario

### Fase 6: Módulos Auxiliares
1. Implementar Disponibilidad (horarios semanales)
2. Implementar Historiales Clínicos
3. Implementar Promociones
4. Implementar Pagos Empleados

### Fase 7: Analítica
1. Implementar Reports con todos los endpoints
2. Implementar consultas SQL con QueryBuilder
3. Optimizar queries con índices

### Fase 8: Seguridad y Producción
1. Configurar Helmet, CORS, Rate Limiting
2. Activar `synchronize: false` en TypeORM
3. Generar migraciones
4. Escribir tests e2e para flujos críticos
5. Configurar Dockerfile y docker-compose

---

## SECCIÓN 12: NOTAS FINALES

- Este documento está diseñado para ser consumido por dos agentes independientes: uno para el backend (NestJS) y otro para el frontend (Angular).
- El contrato de API definido en la **SECCIÓN 5** es el contrato vinculante entre ambos.
- Cualquier cambio en la API debe reflejarse primero en este documento y luego implementarse en ambos lados simultáneamente.
- Las reglas de negocio de la **SECCIÓN 6** deben implementarse tanto en el backend (validación final) como en el frontend (validación temprana para UX).
- El esquema de base de datos de la **SECCIÓN 7** es la fuente de verdad para el modelo de datos.

---

*Documento generado el 2026-07-25. Versión 2.0.0 del sistema SpaGrace.*
