Historia Técnica y Registro Cronológico de Decisiones: Proyecto SpaGrace

Este documento recopila la trazabilidad técnica completa, decisiones de diseño, evolución del modelo de datos, problemas encontrados y soluciones aplicadas durante todo el ciclo de desarrollo del sistema SpaGrace.

1. Línea del Tiempo Cronológica del Desarrollo

Fase 1: Arquitectura Base e Infraestructura de Base de Datos

Inicialización: Se estableció la separación estricta entre Frontend (Angular) y Backend (NestJS Monolith Layer).

Modelo inicial: Definición del esquema inicial de base de datos MySQL/MariaDB (spa_consultorio_db), mapeando usuarios, empleados, servicios, turnos, cobros e historiales clínicos.

Autenticación: Implementación del flujo JWT con hash Bcrypt (factor de costo 10) y JwtStrategy con guards de rutas basados en roles (admin, recepcionista, terapeuta, cliente).

Fase 2: Rediseño del Agendamiento y Finanzas

Evolución del modelo de Turnos: Reestructuración de la relación entre Turno y Servicio de 1:1 a Muchos a Muchos (M:N) mediante la tabla intermedia turnos_servicios.

Automatización Contable: Creación automática del registro Cobro al agendar un turno y cálculo automático de saldos pendientes en la base de datos.

Módulo de Reportes: Creación de consultas de agregación SQL (QueryBuilder) expuestas vía API para alimentar gráficos de estado de turnos (ApexCharts).

Fase 3: Optimización de la Interfaz de Usuario (Angular Client)

Reorganización de la Agenda: División por pestañas de estado (Activos, Atendidos, Cancelados/Ausentes) con paginación en cliente.

Refactorización de Formularios Reactivos: Reemplazo de selectores de servicios rígidos por buscadores inteligentes de autocompletado en tiempo real.

Gestión de Cobros y Reembolsos: Integración de modales de cobranza final y habilitación de la acción de reembolso de adelantos para citas canceladas/ausentes.

Fase 4: Reestructuración del Catálogo de Servicios y Personal

Servicios Jerárquicos: Separación clara entre Servicios Principales y Adiciones (Add-ons) usando autorreferenciación (parent_servicio_id).

Creación Atómica de Empleados: Unificación de la creación de User y Empleado en una sola transacción HTTP/DTO para evitar inconsistencias de datos.

Control de Atribuciones: Interfaz visual para la asignación dinámica de catálogo de servicios habilitados por terapeuta mediante checkboxes y validación en backend (.every()).

2. Clasificación Temática de Cambios

A. Qué Descartamos

Relación Directa 1:1 entre Turno y Servicio: Se descartó el modelo original donde una cita solo podía incluir un único servicio. Esto impedía agendar paquetes de bienestar o sesiones combinadas.

Creación en Dos Pasos para el Personal: Se eliminó el flujo que requería crear primero un usuario genérico en el módulo de usuarios y luego navegar al módulo de empleados para enlazar el perfil.

Listas Desplegables Básicas (<select>) para Catálogos Extensos: Se descartaron los desplegables HTML tradicionales en el agendamiento y en la selección de servicios padre debido a problemas de escalabilidad visual al crecer el catálogo.

Desarrollo de Aplicaciones Nativas (iOS / Android): Se descartó la creación de apps nativas en favor de una arquitectura Web / PWA por costos, mantenibilidad y rapidez de despliegue.

B. Qué Modificamos

Esquema de Turnos y Cobros:

Modificado para almacenar la suma total dinámica de los paquetes de servicios seleccionados (precio_servicio_base).

Adición del estado reembolsado en la entidad Cobro.

Formulario de Registro de Servicios:

Modificado para incluir selectores condicionales (Principal vs Add-on), haciendo que el campo parent_servicio_id sea obligatorio únicamente si se selecciona el tipo Add-on.

Filtro de la Agenda:

Pasó de ser un filtrado estático por estado a un buscador global reactivo con RxJS (debounceTime(300)) que busca por cliente, empleado o nombre de servicio.

C. Qué Mejoramos

Desempeño Financiero en Base de Datos:

Uso de columnas calculadas persistidas (STORED GENERATED COLUMNS) para monto_pendiente (en cobros) y monto_neto (en nóminas), liberando al servidor NestJS de cálculos aritméticos redundantes.

Experiencia de Usuario (UX) en Agendamiento:

Creación de un buscador multiselección en TurnoFormComponent con etiquetas interactivas (tags) para remover servicios agregados y visualización instantánea de la suma acumulada del paquete.

Gestión de Sesión:

Inclusión de modales de confirmación explícita para acciones destructivas (eliminación de citas, desvinculación de personal) y cierres de sesión accidental.

Manejo de Respuestas Reactivas:

Uso extendido de Angular Signals para reflejar cambios en la interfaz de usuario de grano fino sin re-renderizar árboles de componentes completos.

3. Problemas Encontrados y Soluciones Elegidas

Problema 1: Incompatibilidad de Tipos Enum entre DTOs y Servicios Backend

Inconveniente: Al crear empleados con usuario integrado, NestJS rechazaba la petición por incompatibilidad de tipos entre el string enviado ('terapeuta') y el enum fuertemente tipado UserRole.

Solución Elegida: Importación explícita del enum UserRole en EmpleadosService y conversión de tipo (as UserRole) en el método de creación.

Problema 2: Error de Compilación en Plantilla HTML de Angular (Parser Error setTimeout)

Inconveniente: Intentar ejecutar setTimeout() directamente en la plantilla HTML para manejar la pérdida de foco (blur) del buscador provocó el error de compilación NG5002: Parser Error.

Solución Elegida: Traslado de la lógica asíncrona fuera del HTML mediante el método onSearchBlur() dentro de la clase TypeScript del componente.

Problema 3: Desfase de Propiedades en la Interfaz Empleado del Frontend

Inconveniente: La plantilla de administración de personal no reconocía la propiedad activo ni la relación servicios, arrojando errores de compilación TS2339.

Solución Elegida: Actualización de la interfaz TypeScript Empleado en Angular para incluir activo: boolean y servicios: Servicio[], igualando la estructura retribuida por TypeORM.

Problema 4: Simulaciones de Envío en Formulario (Placeholder / Mock Submits)

Inconveniente: Al registrar un empleado, la aplicación mostraba la notificación de éxito pero los datos no se persistían en la base de datos debido a un método onSubmit() incompleto (console.log).

Solución Elegida: Implementación del DTO anidado CreateEmpleadoWithUserDto e integración del cliente HTTP contra el endpoint POST /empleados.

4. Decisiones de Arquitectura Tomadas

Estrategia Decoupled Monorepo: Separación completa entre Backend (spa-backend) y Frontend (spa-frontend) comunicados exclusivamente mediante API REST (JSON) y cabeceras JWT.

Integridad Transaccional: Validación en capas (DTO Pipe -> Service Logic -> DB Constraint) asegurando que ninguna cita pueda guardarse si el terapeuta seleccionado no posee los permisos/capacidades para ejecutar todos los servicios del paquete.

Autenticación Centralizada: Uso de HttpInterceptorFn en Angular para inyectar automáticamente el Bearer Token en todas las peticiones salientes y JwtAuthGuard / RolesGuard en NestJS para proteger controladores.

5. Funcionalidades que Cambiaron

Asignación de Personal: Pasó de ser un campo de texto libre a estar vinculado a la tabla usuarios mediante relaciones 1:1, permitiendo a los empleados tener credenciales de acceso a la plataforma según su rol.

Cálculo de Precios: Pasó de un precio estático fijado en el servicio a un cálculo dinámico acumulativo en el frontend y validado en backend al armar paquetes de turnos.

Procesamiento de Pagos: Se extendió el ciclo de vida del cobro para soportar adelantos (pendiente_adelanto, adelanto_pagado), liquidación final (pagado_completo) y devoluciones (reembolsado).

6. Estado Actual del Proyecto y Tareas Pendientes

Funcionalidades Completadas y Operativas

Autenticación JWT y control de acceso basado en roles (admin, recepcionista, terapeuta, cliente).

Catálogo jerárquico de servicios (Principales y Add-ons) con buscador dinámico.

Agenda interactiva con creación de turnos simples/complejos, filtros en tiempo real y paginación.

Gestión de cobros, adelantos, cupones de promoción y reembolsos.

Módulo de personal con asociación unificada de usuario/empleado y mapa de servicios habilitados.

Dashboard analítico con gráficos interactivos ApexCharts.

Pendientes para Futuras Fases (Roadmap)

Sincronización en Tiempo Real (WebSockets): Implementación de NestJS Gateways para refrescar la agenda automáticamente cuando múltiples recepcionistas agendan en paralelo.

Notificaciones Automatizadas: Integración con API de WhatsApp (Meta Business / Twilio) para recordatorios automáticos de citas.

Gestión de Archivos Adjuntos: Integración con almacenamiento en la nube (S3 / Cloudinary) para guardar imágenes o documentos médicos en el módulo de Historiales Clínicos.

Service Worker / PWA Support: Adición del manifest y service worker en Angular para soportar instalación directa en móviles y funcionamiento offline parcial.