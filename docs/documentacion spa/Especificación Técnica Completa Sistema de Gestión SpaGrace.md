Especificación Técnica Completa: Sistema de Gestión SpaGrace

1. Objetivo del Proyecto

Proporcionar un sistema integral e interconectado para la gestión operativa, financiera, clínica y administrativa de un centro de bienestar y spa (SpaGrace). El sistema centraliza el agendamiento de turnos complejos (paquetes de servicios), el control de estados de cobro y adelantos, el catálogo jerárquico de servicios (principales y add-ons), la asignación de personal calificado, la disponibilidad horaria, la nómina de empleados y el registro de historiales clínicos.

2. Problema que Resuelve

Desorganización en Agendamiento: Elimina cruces de horarios y asignaciones inválidas de servicios a personal no capacitado.

Control Financiero Deficiente: Resuelve la falta de seguimiento entre turnos reservados, montos de adelanto cobrados, saldos pendientes y devoluciones/reembolsos por cancelaciones.

Falta de Trazabilidad: Unifica el historial clínico del cliente con los turnos atendidos y los terapeutas responsables.

Inflexibilidad en Servicios: Permite agrupar múltiples servicios o adiciones ("add-ons") en una misma sesión de turno calculando dinámicamente el precio total y la duración.

Fricción Administrativa: Automatiza la creación conjunta de usuarios de sistema y perfiles de empleados con sus respectivas atribuciones de servicios.

3. Arquitectura General

El proyecto sigue una arquitectura Cliente-Servidor (Decoupled Monorepo / Split Architecture) con separación estricta entre Frontend y Backend:

+-------------------------------------------------------------------+
|                        SPA FRONTEND (Angular)                     |
|  - Standalone Components   - Reactive Forms   - Signals / RxJS    |
|  - Auth Interceptor        - Tailwind CSS     - NgApexcharts      |
+-------------------------------------------------------------------+
                                  |
                                  | HTTP / REST (JSON)
                                  | Authorization: Bearer <JWT>
                                  v
+-------------------------------------------------------------------+
|                        SPA BACKEND (NestJS)                       |
|  - Controllers (REST API)  - Guards (JWT & Roles)                 |
|  - Services (Business)     - TypeORM Repositories                 |
|  - Class-Validators (DTO)  - Custom Decorators                    |
+-------------------------------------------------------------------+
                                  |
                                  | TypeORM Driver (MySQL/MariaDB)
                                  v
+-------------------------------------------------------------------+
|                      DATABASE (MySQL / MariaDB)                   |
|  - Relational Schema       - Generated Stored Columns             |
|  - Cascade Keys            - Pivot Tables (M:N)                   |
+-------------------------------------------------------------------+


4. Tecnologías Utilizadas

Backend (NestJS Monolith Layer)

Node.js: Runtime de JavaScript.

NestJS (v10+): Framework progresivo para Node.js.

TypeScript: Lenguaje fuertemente tipado.

TypeORM: ORM para gestión de entidades y mapeo relacional.

MySQL / MariaDB: Motor de base de datos relacional.

Passport-JWT & Bcrypt: Autenticación segura mediante Tokens y Hashing de contraseñas.

Class-Validator & Class-Transformer: Validación y transformación declarativa de DTOs.

Frontend (Angular Client Layer)

Angular (v17/v18+): Framework SPA utilizando Standalone Components.

Signals & RxJS: Control de estado reactivo y manejo de flujos asíncronos.

Angular Reactive Forms: Gestión de formularios dinámicos con validaciones asíncronas y reactivas.

Tailwind CSS: Framework CSS para interfaz responsiva.

NgApexcharts: Librería de representación gráfica de reportes.

5. Patrones de Diseño

Repository Pattern: TypeORM abstrae el acceso directo a la base de datos a través de repositorios por entidad.

Dependency Injection (DI): NestJS y Angular inyectan servicios, repositorios e interceptores en controladores y componentes.

DTO Pattern (Data Transfer Object): Desacoplamiento entre la estructura interna de la base de datos y la interfaz pública HTTP.

Guard Pattern: Interceptores de ruta que evalúan token JWT y roles antes de ejecutar lógica del controlador.

Strategy Pattern: JwtStrategy encapsula la extracción e inspección del token Bearer.

Observer Pattern / Reactive Programming: Angular Signals y Observables de RxJS para reflejar cambios de estado en tiempo real.

Single-Responsibility Principle (SOLID): Separación clara entre Controladores (HTTP), Servicios (Negocio) y Entidades (Persistencia).

6. Estructura Completa de Carpetas

spa-project/
├── spa-backend/
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── decorators/
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── dto/
│   │   │   │   ├── login-auth.dto.ts
│   │   │   │   └── register-auth.dto.ts
│   │   │   ├── guard/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   └── strategy/
│   │   │       └── jwt.strategy.ts
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   └── create-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.module.ts
│   │   │   └── users.service.ts
│   │   ├── empleados/
│   │   │   ├── dto/
│   │   │   │   ├── add-servicio.dto.ts
│   │   │   │   ├── create-empleado.dto.ts
│   │   │   │   └── create-empleado-with-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── empleado.entity.ts
│   │   │   ├── empleados.controller.ts
│   │   │   ├── empleados.module.ts
│   │   │   └── empleados.service.ts
│   │   ├── servicios/
│   │   │   ├── dto/
│   │   │   │   ├── create-servicio.dto.ts
│   │   │   │   └── update-servicio.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── servicio.entity.ts
│   │   │   ├── servicios.controller.ts
│   │   │   ├── servicios.module.ts
│   │   │   └── servicios.service.ts
│   │   ├── turnos/
│   │   │   ├── dto/
│   │   │   │   ├── create-turno.dto.ts
│   │   │   │   └── update-turno.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── turno.entity.ts
│   │   │   ├── turnos.controller.ts
│   │   │   ├── turnos.module.ts
│   │   │   └── turnos.service.ts
│   │   ├── cobros/
│   │   │   ├── dto/
│   │   │   │   ├── aplicar-descuento.dto.ts
│   │   │   │   ├── create-cobro.dto.ts
│   │   │   │   └── update-cobro.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── cobro.entity.ts
│   │   │   ├── cobros.controller.ts
│   │   │   ├── cobros.module.ts
│   │   │   └── cobros.service.ts
│   │   ├── disponibilidad/
│   │   │   ├── dto/
│   │   │   │   ├── create-disponibilidad.dto.ts
│   │   │   │   └── update-disponibilidad.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── disponibilidad.entity.ts
│   │   │   ├── disponibilidad.controller.ts
│   │   │   ├── disponibilidad.module.ts
│   │   │   └── disponibilidad.service.ts
│   │   ├── historiales/
│   │   │   ├── dto/
│   │   │   │   ├── create-historial.dto.ts
│   │   │   │   └── update-historial.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── historial.entity.ts
│   │   │   ├── historiales.controller.ts
│   │   │   ├── historiales.module.ts
│   │   │   └── historiales.service.ts
│   │   ├── promociones/
│   │   │   ├── dto/
│   │   │   │   ├── create-promocion.dto.ts
│   │   │   │   └── update-promocion.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── promocion.entity.ts
│   │   │   ├── promociones.controller.ts
│   │   │   ├── promociones.module.ts
│   │   │   └── promociones.service.ts
│   │   ├── pagos-empleados/
│   │   │   ├── dto/
│   │   │   │   ├── create-pago-empleado.dto.ts
│   │   │   │   └── update-pago-empleado.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── pago-empleado.entity.ts
│   │   │   ├── pagos-empleados.controller.ts
│   │   │   ├── pagos-empleados.module.ts
│   │   │   └── pagos-empleados.service.ts
│   │   └── reports/
│   │       ├── reports.controller.ts
│   │       ├── reports.module.ts
│   │       └── reports.service.ts
│   └── package.json
└── spa-frontend/
    ├── src/
    │   ├── main.ts
    │   ├── index.html
    │   ├── styles.css
    │   └── app/
    │       ├── app.config.ts
    │       ├── app.routes.ts
    │       ├── components/
    │       │   ├── empleado-form/
    │       │   ├── pago-form/
    │       │   ├── servicio-form/
    │       │   └── turno-form/
    │       ├── guards/
    │       │   └── auth.guard.ts
    │       ├── interceptors/
    │       │   └── auth.interceptor.ts
    │       ├── layouts/
    │       │   └── dashboard/
    │       ├── pages/
    │       │   ├── login/
    │       │   └── dashboard/
    │       │       ├── agenda/
    │       │       ├── home/
    │       │       ├── personal/
    │       │       └── servicios/
    │       ├── pipes/
    │       │   └── readable-date.pipe.ts
    │       └── services/
    │           ├── auth.service.ts
    │           ├── cobros.service.ts
    │           ├── empleados.service.ts
    │           ├── reports.service.ts
    │           ├── servicios.service.ts
    │           ├── turnos.service.ts
    │           └── users.service.ts
    └── package.json


7. Responsabilidad de Cada Carpeta

backend/src/auth: Autenticación, cifrado de contraseñas, emisión de JWT, validación de permisos por rol.

backend/src/users: Gestión de la tabla base de usuarios y consulta de clientes/personal por rol.

backend/src/empleados: Relación entre usuarios y perfil laboral (especialidad, estado activo y catálogo de servicios autorizados).

backend/src/servicios: Catálogo general de prestaciones con soporte de jerarquías (padres/add-ons).

backend/src/turnos: Núcleo de reservas, control de estados de turnos y sincronización automática con cobros.

backend/src/cobros: Transacciones financieras, cobro de adelantos, saldos pendientes, descuentos y reembolsos.

backend/src/disponibilidad: Configuración de bandas horarias semanales de los empleados.

backend/src/historiales: Registro de evaluaciones médicas o estéticas por cliente.

backend/src/promociones: Definición de códigos de descuento fijos o porcentuales.

backend/src/pagos-empleados: Registro de liquidación de nóminas a los empleados.

backend/src/reports: Métricas agregadas y consultas analíticas de negocio.

frontend/src/app/components: Formularios modales y componentes UI reutilizables.

frontend/src/app/guards: Protección de navegación del lado del cliente.

frontend/src/app/interceptors: Adjunto automático de cabeceras HTTP (Authorization).

frontend/src/app/pages: Vistas completas asociadas a rutas del Router.

frontend/src/app/services: Clientes HTTP de Angular que consumen la REST API del Backend.

8. Responsabilidad de Cada Archivo

Backend Key Files

app.module.ts: Módulo raíz que conecta TypeORM MySQL y los módulos funcionales.

auth.service.ts: Valida credenciales, compara hashes bcrypt y firma JWT tokens.

jwt.strategy.ts: Valida firmas JWT en cabeceras HTTP y adjunta el usuario al objeto Express Request.

roles.guard.ts: Compara los roles adjuntos en los metadatos de los endpoints con el rol del usuario autenticado.

empleados.service.ts: Maneja la creación atómica de Usuario + Empleado y la asociación de servicios.

turnos.service.ts: Valida la asignación de servicios al empleado, calcula montos globales y crea el registro Cobro correspondiente automáticamente.

cobros.service.ts: Lógica de aplicación de promociones, actualización de adelantos y procesamiento de reembolsos.

Frontend Key Files

auth.interceptor.ts: Captura peticiones HTTP y agrega Bearer <token> si existe en localStorage.

auth.guard.ts: Evita la renderización de rutas si el token no está presente.

agenda.component.ts: Maneja el filtrado interactivo por cliente/empleado/servicio, pestañas por estado, paginación y menú popover de acciones para turnos.

turno-form.component.ts: Buscador reactivo en tiempo real con selector dinámico de múltiples servicios y cálculo automático del total del paquete.

servicio-form.component.ts: Selector condicional entre Servicio Principal o Add-on con autocompletado del servicio padre.

empleado-form.component.ts: Formulario de creación unificada (Usuario + Perfil Empleado) y asignación mediante checkboxes de servicios habilitados.

9. Flujo Completo de la Aplicación

Autenticación Inicial: El usuario ingresa credenciales en el cliente web.

Generación de Token: El backend verifica las credenciales y devuelve un JWT de larga duración junto con el objeto del usuario.

Carga del Dashboard: El cliente almacena el token en localStorage y redirige a /dashboard. Se consulta la API de métricas (/reports/summary-by-status) para alimentar los widgets y el gráfico circular ApexCharts.

Agendamiento de Turnos:

El operador ingresa a la Agenda y abre el modal "+ Nuevo Turno".

Selecciona Cliente y Empleado.

Utiliza el campo de búsqueda inteligente de servicios para empaquetar 1 o N servicios.

El sistema calcula dinámicamente la suma de precios.

Al enviar el formulario, NestJS verifica que el empleado pueda ejecutar todos los servicios seleccionados.

Se guarda el turno en estado pendiente y se genera automáticamente una entrada en la tabla cobros con estado pendiente_adelanto.

Atención y Cobro:

Al confirmar la cita, se cambia el estado del turno a confirmado.

Se puede registrar un monto de adelanto.

Una vez atendida la cita, se marca como atendido.

Se registra el pago final cancelando el saldo monto_pendiente.

Cancelación / Reembolso:

Si el turno se cancela o se marca ausente, el sistema habilita la opción de "Reembolsar Adelanto", pasando el estado del pago a reembolsado.

10. Flujo de Autenticación

Cliente envía POST /auth/login con { username, password }.

AuthService llama a UsersService.findByUsername(username).

Si el usuario existe, ejecuta bcrypt.compare(password, user.password).

Si las credenciales coinciden, genera un payload: { sub: user.id, username: user.username, rol: user.rol }.

JwtService.sign(payload) retorna un accessToken.

El frontend recibe el token y lo persiste en localStorage.

En peticiones subsiguientes, authInterceptor extrae el token y lo adjunta en la cabecera Authorization: Bearer <accessToken>.

11. Flujo de Autorización

La petición llega al controlador decorado con @UseGuards(JwtAuthGuard, RolesGuard) y @Roles('admin', 'recepcionista').

JwtAuthGuard invoca a JwtStrategy que desempaqueta el token, verifica su firma con la clave secreta y busca el usuario activo en DB.

Si el usuario es válido, lo adjunta a req.user.

RolesGuard lee los metadatos del endpoint (reflector.get('roles')).

Compara el rol de req.user.rol con la lista permitida. Si coincide, autoriza la ejecución; de lo contrario, responde 403 Forbidden.

12. Roles

admin: Acceso total. Gestión de personal, cobros, catálogo de servicios, nóminas, reportes y agendas.

recepcionista: Gestión de agendas, turnos, clientes, historiales clínicos, cobranzas y aplicación de descuentos. No gestiona nóminas.

terapeuta: Consulta de agendas asignadas, lectura y actualización de historiales clínicos del cliente.

cliente: Usuario final para reserva de turnos en plataforma pública (en fase de integración PWA).

13. Casos de Uso

UC-01: Agendar Turno Complejo

Actor: Recepcionista / Admin

Precondición: Cliente, Empleado y Servicios deben existir.

Flujo:

Seleccionar cliente, empleado, fecha y hora.

Buscar y agregar múltiples servicios al paquete.

Validar que el empleado tenga asignados dichos servicios.

Guardar turno.

Generar cobro asociado por la suma total de los servicios seleccionados.

UC-02: Registrar Empleado Completo

Actor: Admin

Flujo:

Ingresar nombre, email, contraseña, username y rol.

Definir especialidad y estado activo.

Marcar servicios que puede realizar.

Enviar datos. NestJS crea atomicamente el User y el Empleado vinculado.

UC-03: Procesar Reembolso

Actor: Admin / Recepcionista

Precondición: Turno cancelado o ausente con adelanto previamente pagado.

Flujo:

Seleccionar turno en estado cancelado/ausente.

Presionar "Reembolsar Adelanto".

CobrosService.reembolsar() valida que monto_adelanto > 0 y pasa estado_pago a reembolsado.

14. Entidades

User (usuarios)

Representa la cuenta de acceso general al sistema.

id (PK)

nombre (string)

email (string, unique)

username (string, unique, nullable)

password (string, excluded on JSON)

rol (enum: 'admin', 'recepcionista', 'terapeuta', 'cliente')

telefono (string, nullable)

fecha_registro (timestamp)

Empleado (empleados)

Información laboral asociada a un usuario.

id (PK)

especialidad (string)

activo (boolean)

usuario (1:1 Relation with User)

servicios (M:N Relation with Servicio)

Servicio (servicios)

Prestaciones ofrecidas en el spa.

id (PK)

nombre (string)

descripcion (text, nullable)

duracion (number, minutos)

precio (decimal)

parent_servicio_id (1:N Self-referencing FK, nullable)

imagen_url (string, nullable)

activo (boolean)

Turno (turnos)

Reserva de cita programada.

id (PK)

cliente (M:1 with User)

empleado (M:1 with Empleado)

servicios (M:N Relation with Servicio)

fecha (date, YYYY-MM-DD)

hora (time, HH:MM)

precio_servicio_base (decimal)

estado (enum: 'pendiente', 'confirmado', 'cancelado', 'atendido', 'ausente', 'reprogramado')

notas_turno (text, nullable)

fecha_creacion (timestamp)

Cobro (cobros)

Registro contable de cada turno.

id (PK)

turno (1:1 with Turno)

monto_total (decimal)

monto_adelanto (decimal)

monto_pendiente (decimal, virtual stored column)

metodo_pago_adelanto (string, nullable)

metodo_pago_final (string, nullable)

fecha_adelanto (datetime, nullable)

fecha_cobro_final (datetime, nullable)

estado_pago (enum: 'pendiente_adelanto', 'adelanto_pagado', 'pagado_completo', 'cancelado', 'reembolsado')

notas (text, nullable)

Disponibilidad (disponibilidad_empleados)

Franjas de trabajo semanales.

id (PK)

empleado (M:1 with Empleado)

dia_semana (enum: 'lunes'..'domingo')

hora_inicio (time)

hora_fin (time)

activo (boolean)

HistorialClinico (historiales_clinicos)

id (PK)

cliente (M:1 with User)

turno (M:1 with Turno, nullable)

fecha (date)

diagnostico (text)

tratamiento (text)

notas (text)

archivo_url (string, nullable)

PagoEmpleado (pagos_empleados)

id (PK)

empleado (M:1 with Empleado)

fecha_pago (date)

periodo_inicio (date)

periodo_fin (date)

monto_bruto (decimal)

deducciones (decimal)

monto_neto (decimal, virtual stored column)

metodo_pago (string)

referencia_pago (string)

notas (text)

Promocion (promociones)

id (PK)

titulo (string)

descripcion (text)

codigo_descuento (string)

tipo_descuento (enum: 'porcentaje', 'fijo')

valor_descuento (decimal)

aplica_a (enum: 'todos', 'servicio_especifico', 'categoria', 'cumpleanos')

servicioAplicable (M:1 with Servicio, nullable)

creadoPor (M:1 with User)

activo (boolean)

15. Relaciones Entre Entidades

User - Empleado: 1 a 1. Un empleado tiene exactamente un usuario asociado (id_usuario).

Empleado - Servicio: Muchos a Muchos (M:N) mediante la tabla intermedia empleados_servicios.

Turno - Servicio: Muchos a Muchos (M:N) mediante la tabla intermedia turnos_servicios.

User (Cliente) - Turno: 1 a Muchos (1:N). Un cliente puede agendar múltiples turnos.

Empleado - Turno: 1 a Muchos (1:N). Un empleado atiende múltiples turnos.

Turno - Cobro: 1 a 1. Cada turno tiene asignado un único registro de cobro.

Servicio - Servicio: 1 a Muchos (1:N Self-referencing) mediante parent_servicio_id.

Empleado - Disponibilidad: 1 a Muchos (1:N). Un empleado tiene múltiples bloques de horario.

16. Base de Datos

Script DDL SQL Completo

DROP DATABASE IF EXISTS spa_consultorio_db;
CREATE DATABASE spa_consultorio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE spa_consultorio_db;

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
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `empleados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_usuario` INT NOT NULL UNIQUE,
  `especialidad` VARCHAR(100) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `servicios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `duracion` INT NOT NULL,
  `precio` DECIMAL(10,2) NOT NULL,
  `parent_servicio_id` INT DEFAULT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (`parent_servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `empleados_servicios` (
  `id_empleado` INT NOT NULL,
  `id_servicio` INT NOT NULL,
  PRIMARY KEY (`id_empleado`, `id_servicio`),
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `turnos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_empleado` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `precio_servicio_base` DECIMAL(10,2) NOT NULL,
  `estado` ENUM('pendiente','confirmado','cancelado','atendido','ausente','reprogramado') NOT NULL DEFAULT 'pendiente',
  `notas_turno` TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `turnos_servicios` (
  `turnoId` INT NOT NULL,
  `servicioId` INT NOT NULL,
  PRIMARY KEY (`turnoId`, `servicioId`),
  FOREIGN KEY (`turnoId`) REFERENCES `turnos` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`servicioId`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `notas` TEXT DEFAULT NULL,
  FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `disponibilidad_empleados` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_empleado` INT NOT NULL,
  `dia_semana` ENUM('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `historiales_clinicos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_cliente` INT NOT NULL,
  `id_turno` INT DEFAULT NULL,
  `fecha` DATE NOT NULL,
  `diagnostico` TEXT DEFAULT NULL,
  `tratamiento` TEXT DEFAULT NULL,
  `notas` TEXT DEFAULT NULL,
  `archivo_url` VARCHAR(255) DEFAULT NULL,
  FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `promociones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `titulo` VARCHAR(150) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `imagen_url` VARCHAR(255) DEFAULT NULL,
  `fecha_inicio` DATE DEFAULT NULL,
  `fecha_fin` DATE DEFAULT NULL,
  `codigo_descuento` VARCHAR(50) DEFAULT NULL,
  `tipo_descuento` ENUM('porcentaje','fijo') DEFAULT NULL,
  `valor_descuento` DECIMAL(10,2) DEFAULT NULL,
  `aplica_a` ENUM('todos','servicio_especifico','categoria','cumpleanos') NOT NULL DEFAULT 'todos',
  `id_servicio_aplicable` INT DEFAULT NULL,
  `creado_por_id` INT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_servicio_aplicable`) REFERENCES `servicios` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`creado_por_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


17. API Completa

Autenticación (/auth)

POST /auth/register

Request: { nombre, email, password }

Response: User object sin campo password.

POST /auth/login

Request: { username, password }

Response: { accessToken: string, user: User }

GET /auth/profile

Headers: Authorization: Bearer <token>

Response: Datos completos del perfil activo.

Usuarios (/users)

GET /users?rol=cliente

Guard: JwtAuthGuard, RolesGuard ('admin', 'recepcionista')

Response: Array de objetos User filtrados por el query string rol.

Empleados (/empleados)

GET /empleados

Guard: JwtAuthGuard, RolesGuard ('admin')

Response: Array de Empleados incluyendo relaciones usuario y servicios.

POST /empleados

Guard: JwtAuthGuard, RolesGuard ('admin')

Request (CreateEmpleadoWithUserDto):

{
  "usuario": {
    "nombre": "Ana Gomez",
    "email": "ana@spagrace.com",
    "password": "Password123",
    "username": "anagomez",
    "rol": "terapeuta"
  },
  "especialidad": "Masajes holísticos",
  "activo": true,
  "serviciosIds": [1, 2, 5]
}


Response: Objeto Empleado persistido con ID asignado.

POST /empleados/:id/servicios

Request: { id_servicio: number }

Response: Empleado actualizado con el nuevo servicio en su catálogo.

Servicios (/servicios)

GET /servicios

Public Access

Response: Lista de servicios activos/inactivos con relación parentServicio.

POST /servicios

Guard: JwtAuthGuard

Request: { nombre, descripcion, duracion, precio, parent_servicio_id, activo }

PATCH /servicios/:id

DELETE /servicios/:id

Turnos (/turnos)

GET /turnos?estado=pendiente

Guard: JwtAuthGuard

Response: Array de turnos ordenados por fecha y hora ascendente.

POST /turnos

Guard: JwtAuthGuard

Request:

{
  "id_cliente": 12,
  "id_empleado": 3,
  "id_servicios": [1, 4],
  "fecha": "2026-08-10",
  "hora": "15:00"
}


PATCH /turnos/:id (Actualizar estado o datos)

DELETE /turnos/:id

Cobros (/cobros)

GET /cobros

PATCH /cobros/:id

Request: { monto_adelanto, metodo_pago_adelanto, estado_pago, notas }

PATCH /cobros/:id/aplicar-descuento

Request: { codigo_descuento: string }

PATCH /cobros/:id/reembolsar

Response: Objeto Cobro con estado_pago = 'reembolsado'.

Reportes (/reports)

GET /reports/summary-by-status

Guard: JwtAuthGuard, RolesGuard ('admin', 'recepcionista')

Response: { "pendiente": 5, "atendido": 18, "cancelado": 2 }

18. Middleware, Guards e Interceptors

Backend

JwtAuthGuard: Extiende AuthGuard('jwt'). Se encarga de requerir un token válido en la cabecera HTTP.

RolesGuard: Implementa CanActivate. Evalúa los metadatos 'roles' pasados mediante el decorador custom @Roles(...) comparándolos contra el rol del usuario presente en request.user.

Frontend

authInterceptor: Función HttpInterceptorFn de Angular que detecta cualquier petición saliente hacia la API, recupera el token de localStorage y adjunta el header Authorization: Bearer ${token}.

authGuard: CanActivateFn de Angular Router que redirige a /login en caso de que no exista el token de autenticación.

19. Servicios

UsersService: Consultas directas sobre la tabla usuarios (búsqueda por email, username, rol o ID).

EmpleadosService: Creación transaccional implícita de usuarios y perfiles de empleados, adjuntando la lista de servicios autorizados mediante TypeORM In().

TurnosService: Servicio principal de agendamiento. Mapea la suma de precios de paquetes de servicios, comprueba autorizaciones del personal y dispara la creación del registro de Cobro.

CobrosService: Lógica de cálculo de saldos, validación de expiración y alcance de cupones de promoción y procesamiento de devoluciones.

ReportsService: Agregaciones SQL mediante QueryBuilder para conteos por estado.

20. Repositorios

Se utiliza el patrón Repositorio nativo de TypeORM, inyectado mediante @InjectRepository(Entity):

Repository<User>

Repository<Empleado>

Repository<Servicio>

Repository<Turno>

Repository<Cobro>

Repository<Promocion>

Repository<Disponibilidad>

Repository<HistorialClinico>

Repository<PagoEmpleado>

21. DTOs (Data Transfer Objects)

Todos los DTOs están validados en runtime usando class-validator:

CreateUserDto: Valida email, nombre, rol (enum) y password mínimo 6 caracteres.

LoginAuthDto: Valida username no vacío y password.

CreateEmpleadoWithUserDto: DTO anidado que usa @ValidateNested() para procesar la entidad usuario interna y el perfil del empleado simultáneamente.

CreateTurnoDto: Recibe id_servicios como un arreglo numérico (@IsArray(), @IsInt({ each: true })), validando la fecha ISO y formato HH:MM.

AplicarDescuentoDto: Valida la presencia de codigo_descuento.

22. Validaciones

Atribución de Empleados: Antes de guardar un turno, el servicio extrae los IDs de servicios habilitados del empleado y comprueba con .every() que el empleado tenga autorización para ejecutar todos los servicios contenidos en la solicitud.

Solapamiento de Citas: El backend comprueba la disponibilidad horaria del empleado.

Unicidad: Restricción a nivel de base de datos y validación previa en servicio para email y username.

Reglas Financieras: Imposibilidad de ejecutar reembolsos si el monto de adelanto es $0 o si el pago no tiene estado adelanto_pagado.

23. Configuración

Backend (app.module.ts)

Configuración TypeORM mysql:

host: 'localhost'

port: 3306

database: 'spa_consultorio_db'

synchronize: true (Solo desarrollo)

entities: [__dirname + '/**/*.entity{.ts,.js}']

Frontend (app.config.ts)

Proveedores globales:

provideRouter(routes)

provideHttpClient(withInterceptors([authInterceptor]))

24. Variables de Entorno

Para migrar el entorno a producción, se deben parametrizar las siguientes variables:

Backend .env

PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=spa_consultorio_db
JWT_SECRET=ESTA-ES-MI-CLAVE-SECRETA-SUPER-SEGURA-2025
JWT_EXPIRES_IN=1d


Frontend environment.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};


25. Dependencias

Backend (package.json)

@nestjs/common, @nestjs/core, @nestjs/platform-express

@nestjs/typeorm, typeorm, mysql2

@nestjs/jwt, @nestjs/passport, passport, passport-jwt

bcrypt, @types/bcrypt

class-validator, class-transformer

Frontend (package.json)

@angular/core, @angular/common, @angular/router, @angular/forms

rxjs

tailwindcss, postcss, autoprefixer

apexcharts, ng-apexcharts

26. Seguridad

Hashing: Contraseñas encriptadas obligatoriamente con bcrypt y un factor de costo (salt) de 10.

Exclusión de Contraseñas: Atributo @Exclude() en la propiedad password de User para prevenir filtración involuntaria en respuestas JSON.

Protección CORS: Habilitada en el servidor NestJS.

Sanitización DTO: NestJS ValidationPipe con whitelist: true para descartar automáticamente propiedades no declaradas en los DTOs.

JWT Expiration: Tokens configurados para caducar y requerir reautenticación.

27. Manejo de Errores

El backend utiliza las excepciones HTTP nativas de NestJS:

NotFoundException (404): Entidades, servicios, turnos o empleados no encontrados.

BadRequestException (400): Intentos de asignación inválida, cupones vencidos o estado incomprensible de cobro.

ConflictException (409): Intento de duplicación de correos o usernames.

UnauthorizedException (401): Credenciales de login incorrectas o tokens expirados/modificados.

28. Logging

NestJS Logger predeterminado activo en modo desarrollo, registrando arranque de módulos, mapeo de rutas HTTP (RouterExplorer) y excepciones no controladas en servidor.

29. Rendimiento

Columnas Generadas (Stored Computed Columns): El saldo restante de los cobros (monto_pendiente) y el sueldo neto (monto_neto) son calculados automáticamente por el motor de la base de datos MySQL, liberando de carga de cálculo al servidor de aplicaciones.

Angular Signals: Cargas y actualizaciones reactivas de grano fino en los componentes de UI que evitan ciclos de detección de cambios innecesarios en todo el árbol de componentes (Change Detection Optimization).

Paginación en Cliente: La tabla de agenda desacopla la renderización en bloques paginados (7, 10, 15 elementos).

30. Escalabilidad

Separación Estricta Monolito-Frontend: Permite migrar el servidor NestJS a microservicios en el futuro (ej. módulo de cobros o módulo de agendamiento independientes) sin alterar el frontend Angular.

PWA Strategy: Arquitectura preparada para convertir la aplicación web en una Progressive Web App mediante la incorporación de un Service Worker y un Manifest, evitando el costo de despliegue y mantenimiento en tiendas nativas (App Store / Play Store).

31. Mejoras Futuras

Implementación de WebSockets (Gateway en NestJS) para la actualización en tiempo real de la tabla de la agenda cuando múltiples recepcionistas agendan citas simultáneamente.

Módulo de notificaciones automáticas por WhatsApp o Correo electrónico para la confirmación de turnos.

Carga de archivos reales (almacenamiento S3 / Cloudinary) para el módulo de Historiales Clínicos.

32. Decisiones Técnicas Tomadas

Uso de PWA sobre Aplicación Nativa: Se decidió enfocar la estrategia móvil en una PWA (Progressive Web App) adaptando el Frontend Angular con diseño 100% responsivo. Razones: reutilización del 100% de la lógica de negocio, despliegue instantáneo mediante URL/QR sin requerir revisiones en app stores y nulo consumo de almacenamiento local en los dispositivos del personal/clientes.

Múltiples Servicios por Turno (Tabla Pivote turnos_servicios): Se refactorizó la relación inicial 1:1 entre Turno y Servicio a una relación Muchos a Muchos para posibilitar el empaquetado dinámico de servicios en una misma reserva.

Asignación Conjunta de Usuario y Empleado: Se creó un endpoint específico POST /empleados con CreateEmpleadoWithUserDto para evitar la inconsistencia de datos al requerir dos peticiones separadas al registrar un nuevo miembro del equipo.