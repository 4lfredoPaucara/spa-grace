Roadmap de Reconstrucción del Proyecto SpaGrace

Este documento define la hoja de ruta secuencial para reconstruir el sistema SpaGrace desde cero. Está estructurado en 8 fases lógicas organizadas de manera que las dependencias críticas de backend y modelado de datos se resuelvan antes de avanzar a la interfaz y lógica reactiva en el frontend.

Fase 1: Base de Datos, Infraestructura Backend e Identidad (Auth & Users)

Objetivo

Establecer la estructura de la base de datos MySQL/MariaDB, la inicialización del proyecto NestJS, el ORM (TypeORM) y el sistema de autenticación centralizado basado en JWT y Roles.

Archivos Involucrados

spa-backend/src/main.ts

spa-backend/src/app.module.ts

spa-backend/src/users/entities/user.entity.ts

spa-backend/src/users/dto/create-user.dto.ts

spa-backend/src/users/users.module.ts

spa-backend/src/users/users.service.ts

spa-backend/src/users/users.controller.ts

spa-backend/src/auth/auth.module.ts

spa-backend/src/auth/auth.service.ts

spa-backend/src/auth/auth.controller.ts

spa-backend/src/auth/strategy/jwt.strategy.ts

spa-backend/src/auth/guard/jwt-auth.guard.ts

spa-backend/src/auth/guard/roles.guard.ts

spa-backend/src/auth/decorators/roles.decorator.ts

spa-backend/src/auth/dto/login-auth.dto.ts

spa-backend/src/auth/dto/register-auth.dto.ts

Dependencias

Servidor MySQL / MariaDB activo (spa_consultorio_db).

Paquetes backend: @nestjs/typeorm, typeorm, mysql2, @nestjs/jwt, @nestjs/passport, passport, passport-jwt, bcrypt, class-validator, class-transformer.

Orden Recomendado de Ejecución

Configurar script DDL e importar tablas usuarios.

Inicializar el monolito NestJS y configurar AppModule con TypeOrmModule.forRoot().

Crear entidad User y CreateUserDto con el enum de roles (admin, recepcionista, terapeuta, cliente).

Implementar UsersModule y métodos de búsqueda en UsersService (findByEmail, findByUsername).

Configurar AuthModule, JwtStrategy, AuthService con cifrado Bcrypt (costo 10) y endpoints /auth/register y /auth/login.

Implementar JwtAuthGuard, RolesGuard y el decorador custom @Roles().

Criterios de Aceptación

Se pueden registrar usuarios nuevos con contraseñas encriptadas con Bcrypt.

El endpoint POST /auth/login devuelve un JWT válido y el perfil del usuario sin la propiedad password.

El endpoint GET /auth/profile está protegido por JWT y responde los datos del token activo.

Los roles restringen exitosamente los accesos en controladores según la anotación @Roles().

Fase 2: Catálogo Jerárquico de Servicios y Perfil de Empleados

Objetivo

Modelar el catálogo de prestaciones (Servicios Principales y Add-ons) y la infraestructura de personal unificando la cuenta de usuario con el perfil laboral de empleado y sus atribuciones.

Archivos Involucrados

spa-backend/src/servicios/entities/servicio.entity.ts

spa-backend/src/servicios/dto/create-servicio.dto.ts

spa-backend/src/servicios/dto/update-servicio.dto.ts

spa-backend/src/servicios/servicios.module.ts

spa-backend/src/servicios/servicios.service.ts

spa-backend/src/servicios/servicios.controller.ts

spa-backend/src/empleados/entities/empleado.entity.ts

spa-backend/src/empleados/dto/create-empleado-with-user.dto.ts

spa-backend/src/empleados/dto/add-servicio.dto.ts

spa-backend/src/empleados/empleados.module.ts

spa-backend/src/empleados/empleados.service.ts

spa-backend/src/empleados/empleados.controller.ts

Dependencias

Fase 1 (Entidad User, UsersModule y sistema de autenticación/roles).

Orden Recomendado de Ejecución

Crear la entidad Servicio con autorreferencia (parent_servicio_id) y relación inversa hacia Empleado.

Implementar DTOs y CRUD completo en ServiciosService y ServiciosController.

Crear las tablas pivote empleados_servicios en BD y definir la relación M:N en Empleado.

Implementar CreateEmpleadoWithUserDto (DTO anidado con @ValidateNested).

Desarrollar la creación transaccional en EmpleadosService.create() para guardar User + Empleado + asignación inicial de Servicios.

Exponer endpoints para listar empleados y asignar/remover servicios habilitados.

Criterios de Aceptación

El endpoint GET /servicios retorna la estructura de árbol/relación entre servicios principales y add-ons.

POST /empleados crea atómicamente el usuario y el empleado sin dejar registros huérfanos.

Un empleado puede tener 0 o N servicios asociados en la tabla pivote empleados_servicios.

Fase 3: Motor de Agendamiento Complejo (Turnos) y Finanzas (Cobros)

Objetivo

Desarrollar el core transaccional del spa: reservas que integran múltiples servicios (paquetes), validación de competencias del personal y generación automática de registros contables con columnas calculadas.

Archivos Involucrados

spa-backend/src/turnos/entities/turno.entity.ts

spa-backend/src/turnos/dto/create-turno.dto.ts

spa-backend/src/turnos/dto/update-turno.dto.ts

spa-backend/src/turnos/turnos.module.ts

spa-backend/src/turnos/turnos.service.ts

spa-backend/src/turnos/turnos.controller.ts

spa-backend/src/cobros/entities/cobro.entity.ts

spa-backend/src/cobros/dto/create-cobro.dto.ts

spa-backend/src/cobros/dto/update-cobro.dto.ts

spa-backend/src/cobros/dto/aplicar-descuento.dto.ts

spa-backend/src/cobros/cobros.module.ts

spa-backend/src/cobros/cobros.service.ts

spa-backend/src/cobros/cobros.controller.ts

Dependencias

Fase 1 (User, AuthModule).

Fase 2 (Servicio, Empleado).

Orden Recomendado de Ejecución

Crear la tabla relacional turnos_servicios (M:N) y las entidades Turno y Cobro.

Configurar en DB y TypeORM la columna calculada persistida monto_pendiente (monto_total - monto_adelanto).

Construir CreateTurnoDto aceptando arreglos numéricos de servicios (id_servicios).

Desarrollar la lógica en TurnosService.create():

Validar con .every() que el empleado pueda realizar todos los servicios elegidos.

Calcular la suma total acumulada.

Persistir el turno y disparar la creación del Cobro asociado en estado pendiente_adelanto.

Implementar ciclo de estados de pago en CobrosService: adelantos, pagos completos y la acción reembolsar().

Criterios de Aceptación

Si se intenta agendar un turno con un servicio no habilitado para el terapeuta elegido, la API responde 400 Bad Request.

La creación de un turno genera automáticamente una entrada vinculada 1:1 en la tabla cobros.

monto_pendiente se recalcula en la base de datos sin necesidad de operaciones matemáticas manuales en Node.js.

El método reembolsar() valida que exista un adelanto mayor a $0 antes de modificar el estado a reembolsado.

Fase 4: Módulos Auxiliares y Dashboard Analítico

Objetivo

Completar las áreas operativas complementarias: horarios de trabajo (disponibilidad), registros de salud/estética (historiales clínicos), cupones de descuento (promociones), nómina y agregación de métricas.

Archivos Involucrados

spa-backend/src/disponibilidad/* (Entity, DTOs, Service, Controller, Module)

spa-backend/src/historiales/* (Entity, DTOs, Service, Controller, Module)

spa-backend/src/promociones/* (Entity, DTOs, Service, Controller, Module)

spa-backend/src/pagos-empleados/* (Entity, DTOs, Service, Controller, Module)

spa-backend/src/reports/reports.module.ts

spa-backend/src/reports/reports.service.ts

spa-backend/src/reports/reports.controller.ts

Dependencias

Fases 1, 2 y 3.

Orden Recomendado de Ejecución

Construir el módulo Disponibilidad para franjas de horario por día de semana.

Implementar Historiales vinculados a clientes y opcionalmente a turnos específicos.

Crear módulo Promociones con tipos de descuento (porcentaje, fijo) y vinculación a CobrosService.aplicarDescuento().

Desarrollar módulo PagosEmpleados con la columna calculada monto_neto (monto_bruto - deducciones).

Desarrollar ReportsService utilizando TypeORM QueryBuilder para consultas agrupadas por estado de turno (summary-by-status).

Criterios de Aceptación

Los reportes responden estructuras agregadas en formato JSON ({ "pendiente": X, "atendido": Y, "cancelado": Z }).

Las promociones se invalidan automáticamente si han superado su fecha_fin o si no aplican al servicio seleccionado.

Fase 5: Frontend - Configuración Base, Layout, Autenticación e Interceptores

Objetivo

Inicializar la aplicación SPA con Angular, Tailwind CSS y ApexCharts; estructurar la seguridad del cliente con interceptores y guards, y desplegar el layout principal del Dashboard.

Archivos Involucrados

spa-frontend/src/app/app.config.ts

spa-frontend/src/app/app.routes.ts

spa-frontend/src/app/services/auth.service.ts

spa-frontend/src/app/interceptors/auth.interceptor.ts

spa-frontend/src/app/guards/auth.guard.ts

spa-frontend/src/app/pages/login/login.component.ts (.html, .css)

spa-frontend/src/app/layouts/dashboard/dashboard.component.ts (.html)

spa-frontend/src/app/pages/dashboard/home/home.component.ts (.html)

Dependencias

Proyecto Angular (v17/v18+) funcional.

Tailwind CSS configurado en styles.css.

Librerías apexcharts y ng-apexcharts instaladas.

Backend operativo (Fases 1 a 4).

Orden Recomendado de Ejecución

Configurar app.config.ts con provideHttpClient(withInterceptors([authInterceptor])).

Crear authInterceptor para adjuntar Authorization: Bearer <token> en todas las peticiones salientes.

Implementar AuthService utilizando Angular Signals para la variable currentUser.

Crear authGuard para proteger rutas hijas del dashboard.

Diseñar la pantalla de Login con Angular Reactive Forms.

Construir el layout DashboardComponent (barra lateral, encabezado, usuario activo y modal de cierre de sesión).

Crear HomeComponent integrando NgApexchartsModule y consumiendo ReportsService.getSummaryByStatus().

Criterios de Aceptación

Las rutas desprotegidas redirigen automáticamente a /login.

Al iniciar sesión, el token JWT se guarda en localStorage y las vistas se actualizan reactivamente.

El widget ApexCharts en el inicio grafica correctamente la distribución de estados recibida de la API.

Fase 6: Frontend - Módulo de Agenda Reactiva y Agendamiento Complejo

Objetivo

Construir la pantalla operativa principal: tabla de agenda con pestañas por estado, paginación local, filtro de búsqueda general en tiempo real y el modal para empaquetar servicios.

Archivos Involucrados

spa-frontend/src/app/pipes/readable-date.pipe.ts

spa-frontend/src/app/services/turnos.service.ts

spa-frontend/src/app/services/cobros.service.ts

spa-frontend/src/app/services/users.service.ts

spa-frontend/src/app/components/turno-form/turno-form.component.ts (.html)

spa-frontend/src/app/components/pago-form/pago-form.component.ts (.html)

spa-frontend/src/app/pages/dashboard/agenda/agenda.component.ts (.html, .css)

Dependencias

Fase 5 (Layout, Interceptor, Guards).

Backend en funcionamiento (Endpoints /turnos, /cobros, /users, /servicios).

Orden Recomendado de Ejecución

Crear el pipe ReadableDatePipe para formatear fechas e intervalos de tiempo en español conversacional.

Crear TurnosService y CobrosService con los métodos HTTP correspondientes.

Construir TurnoFormComponent:

Implementar FormControl de búsqueda de servicios con debounceTime(200).

Manejar la adición/remoción de etiquetas (tags) de servicios.

Calcular la suma total acumulada mediante una señal computada (computed()).

Construir PagoFormComponent para registro de adelantos o liquidaciones finales.

Implementar AgendaComponent:

Agregar buscador general searchControl con filtro reactivo sobre cliente, empleado y servicio.

Implementar pestañas de estados (Activos, Atendidos, Cancelados/Ausentes).

Agregar paginación dinámica y menú popover de acciones por fila.

Integrar la acción "Reembolsar Adelanto" consumiendo el endpoint del backend.

Criterios de Aceptación

Escribir en el buscador de la agenda filtra instantáneamente las filas sin reargar la página.

El modal de turnos suma automáticamente los precios de los servicios seleccionados y los envía como un paquete al backend.

Las notificaciones flotantes (toasts) confirman las acciones (creación, edición, cambios de estado o reembolsos).

Fase 7: Frontend - Módulos de Administración (Servicios y Personal)

Objetivo

Desplegar las interfaces administrativas para el control del catálogo de prestaciones jerárquicas y la gestión unificada de personal y sus capacidades.

Archivos Involucrados

spa-frontend/src/app/services/servicios.service.ts

spa-frontend/src/app/services/empleados.service.ts

spa-frontend/src/app/components/servicio-form/servicio-form.component.ts (.html)

spa-frontend/src/app/components/empleado-form/empleado-form.component.ts (.html)

spa-frontend/src/app/pages/dashboard/servicios/servicios.component.ts (.html)

spa-frontend/src/app/pages/dashboard/personal/personal.component.ts (.html)

Dependencias

Fase 5 y Fase 6.

Orden Recomendado de Ejecución

Desarrollar ServicioFormComponent:

Incluir selector de tipo de servicio (Principal vs Add-on).

Implementar buscador autocompletado para asociar el servicio padre únicamente si es Add-on.

Desarrollar ServiciosComponent para listar, editar y eliminar ítems del catálogo.

Desarrollar EmpleadoFormComponent:

Formulario unificado que capture credenciales de usuario y datos laborales.

Mapa de checkboxes para asignar o revocar servicios autorizados al terapeuta.

Desarrollar PersonalComponent con tabla informativa de empleados y estados activo/inactivo.

Criterios de Aceptación

El selector de servicio padre en el formulario de servicios solo es visible si se selecciona el tipo "Add-on".

Al guardar un nuevo empleado, el backend procesa la solicitud completa y la tabla de personal refleja los cambios al instante.

Fase 8: Pruebas de Integración, Optimización y Cierre de Producción

Objetivo

Verificar la integridad transaccional de extremo a extremo, asegurar el cumplimiento de las reglas de seguridad y preparar el sistema para el entorno de producción.

Archivos Involucrados

Todos los archivos de configuración (.env, environment.ts, app.module.ts, app.config.ts).

Dependencias

Fases 1 a 7 completadas.

Orden Recomendado de Ejecución

Probar flujo completo: Registro de Personal -> Asignación de Servicios -> Reserva de Turno -> Registro de Pago -> Atendido -> Reportes.

Probar flujo de cancelación y reembolso de adelantos.

Cambiar la bandera synchronize: false en TypeORM dentro de AppModule para prevenir alteraciones inadvertidas en el esquema.

Configurar variables de entorno (.env para backend y environment.prod.ts para frontend).

Verificar la sanitización de DTOs (ValidationPipe({ whitelist: true })) y el correcto ocultamiento de la propiedad password en todas las respuestas HTTP.

Criterios de Aceptación

Cero errores de compilación TypeScript (tsc) tanto en frontend como en backend.

El sistema previene de forma consistente cualquier asignación de citas a terapeutas no calificados o fuera de disponibilidad.

La base de datos mantiene la consistencia relacional con llaves foráneas y borrados en cascada/set null según la especificación.