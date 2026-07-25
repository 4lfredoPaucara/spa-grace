# Ruta de Trabajo - Reconstrucción SpaGrace v2.0

> **Leyenda:** ⬜ Pendiente | 🔵 En progreso | ✅ Completado | ❌ Bloqueado

---

## CONTROL DE VERSIONES

- **Plataforma:** GitHub
- **Git:** v2.54.0 | Usuario: `Alfredo` | Email: `tteciv@gmail.com`
- **GitHub CLI (gh):** Pendiente de instalación
- **Repo:** PENDIENTE DE CREACIÓN
- **Estrategia de ramas:** `main` (producción) | `develop` (integración) | `feature/*` (módulos)
- **Commits:** Convencionales (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)

### Flujo de trabajo con GitHub

```
main ───────────────────────────────────────────────────────
  │
  └── develop ─────────────────────────────────────────────
        │
        ├── feature/fase1-infra-auth ──────► PR ► develop
        ├── feature/fase2-catalogos ───────► PR ► develop
        ├── feature/fase3-personal ────────► PR ► develop
        └── ...
```

### Reglas
1. Cada fase se desarrolla en su rama `feature/faseX-nombre`
2. Al completar una fase → PR a `develop` → revisión → merge
3. `main` solo recibe merges de `develop` al cierre de hitos
4. Todo commit debe referenciar el ID del módulo (ej: `feat(F1.1): scaffolding inicial`)

---

## FASE 1: INFRAESTRUCTURA Y AUTENTICACIÓN

**Depende de:** Nada (fundación)  
**Objetivo:** Proyecto NestJS funcional, TypeORM conectado a MySQL, sistema JWT con refresh tokens, seeders de datos base.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F1.1 | Scaffolding NestJS 11 + TypeORM 1.1 + MySQL | ✅ | Backend | `npm run start:dev` sin errores |
| F1.2 | ConfigModule + variables de entorno (.env) | ✅ | Backend | `ConfigService` operativo |
| F1.3 | Entidad User + CreateUserDto | ✅ | Backend | Registro de usuarios en BD |
| F1.4 | Módulo Auth (JWT + Bcrypt + Refresh Token) | ✅ | Backend | `POST /auth/login` devuelve tokens |
| F1.5 | Guards: JwtAuthGuard + RolesGuard | ✅ | Backend | Rutas protegidas por rol |
| F1.6 | ValidationPipe global + ExceptionFilter | ✅ | Backend | Errores HTTP estandarizados |
| F1.7 | Seeders: admin, especialidades, categorías | ✅ | Backend | Datos iniciales en BD |
| F1.8 | Swagger/OpenAPI configurado | ✅ | Backend | `GET /api/docs` funcional |
| F1.9 | Esquema DB completo ejecutado | ⬜ | DBA | 15 tablas creadas sin errores |

---

## FASE 2: CATÁLOGOS BASE

**Depende de:** Fase 1  
**Objetivo:** CRUD de especialidades, categorías, servicios jerárquicos y clientes.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F2.1 | CRUD Especialidades | ⬜ | Backend | `POST/GET/PATCH/DELETE /especialidades` |
| F2.2 | CRUD Categorías de Servicios | ⬜ | Backend | `POST/GET/PATCH/DELETE /categorias-servicios` |
| F2.3 | CRUD Servicios (jerárquico: principal/addon) | ⬜ | Backend | `POST /servicios` con validación tipo+parent |
| F2.4 | Endpoints addons y principales | ⬜ | Backend | `GET /servicios/principales` y `GET /servicios/addons/:id` |
| F2.5 | CRUD Clientes | ⬜ | Backend | `POST/GET/PATCH /clientes` con ficha extendida |
| F2.6 | CRUD Users (paginado) | ⬜ | Backend | `GET /users` con filtros rol, search, paginación |

---

## FASE 3: PERSONAL

**Depende de:** Fase 1, Fase 2  
**Objetivo:** Gestión de empleados con creación atómica usuario+empleado y asignación de servicios.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F3.1 | CRUD Empleados (básico) | ⬜ | Backend | `POST/GET/PATCH/DELETE /empleados` |
| F3.2 | Creación atómica Usuario+Empleado+Servicios | ⬜ | Backend | POST con DTO anidado crea todo en una transacción |
| F3.3 | Asignar/Remover servicios a empleado | ⬜ | Backend | `POST/DELETE /empleados/:id/servicios/:servicioId` |
| F3.4 | Endpoint empleados disponibles | ⬜ | Backend | `GET /empleados/disponibles?fecha=&servicioIds=` |

---

## FASE 4: CORE OPERATIVO (TURNOS + COBROS)

**Depende de:** Fase 1, Fase 2, Fase 3  
**Objetivo:** Motor de agendamiento con validaciones, transacciones, y gestión financiera completa.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F4.1 | CRUD Turnos (básico) | ⬜ | Backend | `POST/GET/PATCH/DELETE /turnos` |
| F4.2 | Transacción turno+cobro automática | ⬜ | Backend | Crear turno genera cobro en misma TX |
| F4.3 | Validación de servicios autorizados del empleado | ⬜ | Backend | Rechaza si empleado no puede hacer el servicio |
| F4.4 | Detección de conflictos de horario | ⬜ | Backend | Rechaza solapamiento con turnos existentes |
| F4.5 | Validación de disponibilidad semanal | ⬜ | Backend | Rechaza fuera de horario laboral |
| F4.6 | Registro de adelantos | ⬜ | Backend | `POST /cobros/:id/registrar-adelanto` |
| F4.7 | Registro de pago final | ⬜ | Backend | `POST /cobros/:id/registrar-pago-final` |
| F4.8 | Aplicación de descuentos | ⬜ | Backend | `POST /cobros/:id/aplicar-descuento` p/validaciones |
| F4.9 | Reembolso de adelantos | ⬜ | Backend | `POST /cobros/:id/reembolsar` con validación |
| F4.10 | Transiciones de estado de turnos | ⬜ | Backend | Máquina de estados con reglas de transición |

---

## FASE 5: MÓDULOS AUXILIARES

**Depende de:** Fase 1, Fase 2, Fase 3  
**Objetivo:** Disponibilidad horaria, historiales clínicos, promociones y pagos de empleados.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F5.1 | CRUD Disponibilidad | ⬜ | Backend | Franjas horarias por empleado/día |
| F5.2 | Configuración masiva de horarios | ⬜ | Backend | `POST /disponibilidad/lote` |
| F5.3 | CRUD Historiales Clínicos | ⬜ | Backend | Registro médico vinculado a cliente+turno |
| F5.4 | CRUD Promociones | ⬜ | Backend | Códigos de descuento con validación de vigencia |
| F5.5 | Validación de promociones | ⬜ | Backend | `GET /promociones/validar?codigo=&servicioId=` |
| F5.6 | CRUD Pagos Empleados | ⬜ | Backend | Nómina con monto_neto calculado en DB |

---

## FASE 6: ANALÍTICA Y REPORTES

**Depende de:** Fase 4  
**Objetivo:** Endpoints de reportes para alimentar el dashboard y gráficos.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F6.1 | Dashboard consolidado | ⬜ | Backend | `GET /reports/dashboard` |
| F6.2 | Summary by status | ⬜ | Backend | Conteo de turnos por estado |
| F6.3 | Ingresos por período | ⬜ | Backend | Filtrable por mes/semana/día |
| F6.4 | Ingresos diarios | ⬜ | Backend | Desglose del día |
| F6.5 | Servicios populares | ⬜ | Backend | Ranking con cantidad y monto |
| F6.6 | Rendimiento empleados | ⬜ | Backend | Turnos atendidos + total generado |
| F6.7 | Clientes frecuentes | ⬜ | Backend | Top clientes por visitas |
| F6.8 | Ocupación del día | ⬜ | Backend | % ocupación por empleado |

---

## FASE 7: FRONTEND - BASE Y AUTENTICACIÓN

**Depende de:** Fase 1 (Backend)  
**Objetivo:** SPA Angular funcional con login, layout dashboard y servicios base.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F7.1 | Scaffolding Angular 22 + Tailwind 4 | ⬜ | Frontend | `ng serve` sin errores |
| F7.2 | AuthService + AuthInterceptor + AuthGuard | ⬜ | Frontend | Login funcional, rutas protegidas |
| F7.3 | Pantalla de Login | ⬜ | Frontend | Formulario reactivo, validación, redirección |
| F7.4 | Layout Dashboard (sidebar + header) | ⬜ | Frontend | Menú navegación según rol |
| F7.5 | BaseApiService (paginación genérica) | ⬜ | Frontend | Extensible por todos los servicios |
| F7.6 | Shared components: DataTable, StatusBadge, SearchInput | ⬜ | Frontend | Componentes reutilizables |
| F7.7 | Toast notification system | ⬜ | Frontend | Notificaciones flotantes |

---

## FASE 8: FRONTEND - PANTALLAS PRINCIPALES

**Depende de:** Fase 7 + Fases 2-6 (Backend)  
**Objetivo:** Pantalla de agenda, turnos, cobros, dashboard.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F8.1 | Dashboard Home (widgets + gráficos) | ⬜ | Frontend | ApexCharts donut + bar + cards |
| F8.2 | Agenda de turnos (tabla + filtros + tabs) | ⬜ | Frontend | Pestañas por estado, paginación, buscador |
| F8.3 | Modal TurnoForm (buscador servicios + tags) | ⬜ | Frontend | Selección múltiple, cálculo dinámico |
| F8.4 | Modal PagoForm (adelanto/final/descuento/reembolso) | ⬜ | Frontend | Según estado del cobro |
| F8.5 | CRUD Servicios (tabla + modal) | ⬜ | Frontend | Principal/Addon condicional |
| F8.6 | CRUD Empleados (tabla + modal creación atómica) | ⬜ | Frontend | Checkboxes de servicios |
| F8.7 | CRUD Clientes (tabla + modal ficha extendida) | ⬜ | Frontend | Perfil completo |
| F8.8 | CRUD Promociones (tabla + modal) | ⬜ | Frontend | Campos condicionales según aplica_a |
| F8.9 | Historiales por cliente | ⬜ | Frontend | Buscador + historial |
| F8.10 | Disponibilidad semanal | ⬜ | Frontend | Vista de grilla L-D |
| F8.11 | Pagos empleados (tabla + modal) | ⬜ | Frontend | CRUD con monto_neto calculado |

---

## FASE 9: CIERRE Y PRODUCCIÓN

**Depende de:** Todas las fases anteriores  
**Objetivo:** Pruebas e2e, seguridad, migraciones, Docker.

| ID | Módulo | Estado | Responsable | Verificación |
|----|--------|--------|-------------|-------------|
| F9.1 | Tests e2e - flujo agendamiento completo | ⬜ | Backend | Test pasa: crear empleado → agendar → cobrar → reportes |
| F9.2 | Tests e2e - flujo cancelación y reembolso | ⬜ | Backend | Test pasa: cancelar turno → reembolsar adelanto |
| F9.3 | Helmet + Rate Limiting + CORS producción | ⬜ | Backend | Headers de seguridad presentes |
| F9.4 | synchronize: false + migraciones generadas | ⬜ | Backend | TypeORM migrations funcionales |
| F9.5 | Dockerfile + docker-compose.yml | ⬜ | DevOps | `docker compose up` levanta todo |
| F9.6 | Variables de entorno producción (.env.prod) | ⬜ | Backend | Sin hardcodeos |
| F9.7 | Health check endpoint | ⬜ | Backend | `GET /health` responde 200 |

---

## RESUMEN DE PROGRESO

```
Fase 1 [Infra + Auth]     ✅✅✅✅✅✅✅✅⬜  8/9
Fase 2 [Catálogos Base]   ⬜⬜⬜⬜⬜⬜         0/6
Fase 3 [Personal]         ⬜⬜⬜⬜           0/4
Fase 4 [Turnos + Cobros]  ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/10
Fase 5 [Módulos Aux]      ⬜⬜⬜⬜⬜⬜         0/6
Fase 6 [Reportes]         ⬜⬜⬜⬜⬜⬜⬜⬜      0/8
Fase 7 [Frontend Base]    ⬜⬜⬜⬜⬜⬜⬜       0/7
Fase 8 [Frontend Pages]   ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/11
Fase 9 [Cierre + Prod]    ⬜⬜⬜⬜⬜⬜⬜       0/7
                         ─────────────────
                         Total: 8/68 módulos
```

---

## ORDEN DE EJECUCIÓN RECOMENDADO

```
F1 (Infra+Auth) ──► F2 (Catálogos) ──► F3 (Personal) ──► F4 (Turnos+Cobros) ──► F5 (Auxiliares) ──► F6 (Reportes)
                         │                                                               │
                         └───────────────────────────────────────────────────────────────┘
                                                          │
                                                          ▼
                                                    F7 (Frontend Base)
                                                          │
                                                          ▼
                                                    F8 (Frontend Pages)
                                                          │
                                                          ▼
                                                    F9 (Cierre+Prod)
```

> **Nota:** El frontend base (F7) puede arrancar en paralelo después de F1.  
> Las pantallas del frontend (F8) necesitan los módulos backend de F2 a F6 completos.

---

*Última actualización: 2026-07-25. Este documento se actualiza al completar cada módulo.*
