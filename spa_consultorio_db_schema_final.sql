
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `spa_consultorio_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `spa_consultorio_db`;
DROP TABLE IF EXISTS `categorias_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias_servicios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `icono` varchar(50) DEFAULT NULL,
  `orden` int(11) NOT NULL DEFAULT 0,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clientes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `como_conocio` varchar(100) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  `notas_internas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `cobros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cobros` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_turno` int(11) NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `monto_adelanto` decimal(10,2) DEFAULT 0.00,
  `monto_pendiente` decimal(10,2) GENERATED ALWAYS AS (`monto_total` - `monto_adelanto`) STORED,
  `metodo_pago_adelanto` varchar(50) DEFAULT NULL,
  `metodo_pago_final` varchar(50) DEFAULT NULL,
  `fecha_adelanto` datetime DEFAULT NULL,
  `fecha_cobro_final` datetime DEFAULT NULL,
  `estado_pago` enum('pendiente_adelanto','adelanto_pagado','pagado_completo','cancelado','reembolsado') NOT NULL DEFAULT 'pendiente_adelanto',
  `promocion_aplicada` varchar(50) DEFAULT NULL COMMENT 'C?digo de descuento utilizado',
  `notas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_turno` (`id_turno`),
  KEY `idx_cobros_estado` (`estado_pago`),
  KEY `idx_cobros_fecha` (`created_at`),
  CONSTRAINT `cobros_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `disponibilidad_empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disponibilidad_empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `dia_semana` enum('lunes','martes','miercoles','jueves','viernes','sabado','domingo') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_empleado_dia_hora` (`id_empleado`,`dia_semana`,`hora_inicio`),
  KEY `idx_disp_empleado_dia` (`id_empleado`,`dia_semana`),
  KEY `idx_disp_dia_activo` (`dia_semana`,`activo`),
  CONSTRAINT `disponibilidad_empleados_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `id_especialidad` int(11) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_usuario` (`id_usuario`),
  KEY `idx_empleados_activo` (`activo`),
  KEY `idx_empleados_especialidad` (`id_especialidad`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidades` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `empleados_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleados_servicios` (
  `id_empleado` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  PRIMARY KEY (`id_empleado`,`id_servicio`),
  KEY `id_servicio` (`id_servicio`),
  CONSTRAINT `empleados_servicios_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE,
  CONSTRAINT `empleados_servicios_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `especialidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `especialidades` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `historiales_clinicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `historiales_clinicos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `id_turno` int(11) DEFAULT NULL,
  `fecha` date NOT NULL,
  `diagnostico` text DEFAULT NULL,
  `tratamiento` text DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `archivo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_turno` (`id_turno`),
  KEY `idx_historial_cliente` (`id_cliente`,`fecha`),
  CONSTRAINT `historiales_clinicos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `historiales_clinicos_ibfk_2` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `pagos_empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pagos_empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_empleado` int(11) NOT NULL,
  `fecha_pago` date NOT NULL,
  `periodo_inicio` date NOT NULL,
  `periodo_fin` date NOT NULL,
  `monto_bruto` decimal(10,2) NOT NULL,
  `deducciones` decimal(10,2) DEFAULT 0.00,
  `monto_neto` decimal(10,2) GENERATED ALWAYS AS (`monto_bruto` - `deducciones`) STORED,
  `metodo_pago` varchar(50) DEFAULT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL,
  `notas` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_pagos_empleado_fecha` (`id_empleado`,`fecha_pago`),
  CONSTRAINT `pagos_empleados_ibfk_1` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `promociones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `promociones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `codigo_descuento` varchar(50) DEFAULT NULL,
  `tipo_descuento` enum('porcentaje','fijo') DEFAULT NULL,
  `valor_descuento` decimal(10,2) DEFAULT NULL,
  `aplica_a` enum('todos','servicio_especifico','categoria','cumpleanos') NOT NULL DEFAULT 'todos',
  `id_servicio_aplicable` int(11) DEFAULT NULL,
  `id_categoria_aplicable` int(11) DEFAULT NULL,
  `creado_por_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_descuento` (`codigo_descuento`),
  KEY `id_servicio_aplicable` (`id_servicio_aplicable`),
  KEY `id_categoria_aplicable` (`id_categoria_aplicable`),
  KEY `creado_por_id` (`creado_por_id`),
  KEY `idx_promo_fechas` (`fecha_inicio`,`fecha_fin`),
  KEY `idx_promo_activo` (`activo`),
  CONSTRAINT `promociones_ibfk_1` FOREIGN KEY (`id_servicio_aplicable`) REFERENCES `servicios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `promociones_ibfk_2` FOREIGN KEY (`id_categoria_aplicable`) REFERENCES `categorias_servicios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `promociones_ibfk_3` FOREIGN KEY (`creado_por_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `idx_refresh_usuario` (`id_usuario`),
  KEY `idx_refresh_expires` (`expires_at`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_categoria` int(11) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `duracion` int(11) NOT NULL COMMENT 'Duraci?n en minutos',
  `precio` decimal(10,2) NOT NULL,
  `tipo` enum('principal','addon') NOT NULL DEFAULT 'principal',
  `parent_servicio_id` int(11) DEFAULT NULL COMMENT 'FK auto-referenciada para add-ons',
  `imagen_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_servicios_categoria` (`id_categoria`),
  KEY `idx_servicios_tipo` (`tipo`),
  KEY `idx_servicios_parent` (`parent_servicio_id`),
  CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias_servicios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `servicios_ibfk_2` FOREIGN KEY (`parent_servicio_id`) REFERENCES `servicios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `turnos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NOT NULL,
  `id_empleado` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `duracion_total` int(11) NOT NULL COMMENT 'Minutos totales (suma de servicios del paquete)',
  `precio_total` decimal(10,2) NOT NULL COMMENT 'Suma de precios de servicios',
  `estado` enum('pendiente','confirmado','cancelado','atendido','ausente','reprogramado') NOT NULL DEFAULT 'pendiente',
  `notas_turno` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_turnos_fecha` (`fecha`),
  KEY `idx_turnos_estado` (`estado`),
  KEY `idx_turnos_empleado_fecha` (`id_empleado`,`fecha`),
  KEY `idx_turnos_cliente_fecha` (`id_cliente`,`fecha`),
  KEY `idx_turnos_deleted` (`deleted_at`),
  KEY `idx_turnos_estado_fecha` (`estado`,`fecha`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_empleado`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `turnos_servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `turnos_servicios` (
  `id_turno` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `precio_servicio` decimal(10,2) NOT NULL COMMENT 'Precio congelado al momento de agendar',
  PRIMARY KEY (`id_turno`,`id_servicio`),
  KEY `id_servicio` (`id_servicio`),
  CONSTRAINT `turnos_servicios_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `turnos_servicios_ibfk_2` FOREIGN KEY (`id_servicio`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','recepcionista','terapeuta','cliente') NOT NULL DEFAULT 'cliente',
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sexo` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`),
  KEY `idx_usuarios_rol` (`rol`),
  KEY `idx_usuarios_deleted` (`deleted_at`),
  KEY `idx_usuarios_telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `v_clientes_frecuentes`;
/*!50001 DROP VIEW IF EXISTS `v_clientes_frecuentes`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_clientes_frecuentes` AS SELECT
 1 AS `cliente_id`,
  1 AS `cliente_nombre`,
  1 AS `telefono`,
  1 AS `total_visitas`,
  1 AS `total_gastado`,
  1 AS `ultima_visita` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_dashboard_resumen`;
/*!50001 DROP VIEW IF EXISTS `v_dashboard_resumen`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_dashboard_resumen` AS SELECT
 1 AS `pendientes_hoy`,
  1 AS `confirmados_hoy`,
  1 AS `atendidos_hoy`,
  1 AS `facturado_hoy`,
  1 AS `clientes_nuevos_mes` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_ingresos_diarios`;
/*!50001 DROP VIEW IF EXISTS `v_ingresos_diarios`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_ingresos_diarios` AS SELECT
 1 AS `dia`,
  1 AS `cantidad_turnos`,
  1 AS `total_facturado`,
  1 AS `total_adelantos`,
  1 AS `total_cobrado`,
  1 AS `total_reembolsado` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_ocupacion_diaria`;
/*!50001 DROP VIEW IF EXISTS `v_ocupacion_diaria`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_ocupacion_diaria` AS SELECT
 1 AS `empleado_id`,
  1 AS `empleado_nombre`,
  1 AS `fecha`,
  1 AS `turnos_dia`,
  1 AS `minutos_ocupados`,
  1 AS `minutos_disponibles` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_rendimiento_empleados`;
/*!50001 DROP VIEW IF EXISTS `v_rendimiento_empleados`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_rendimiento_empleados` AS SELECT
 1 AS `empleado_id`,
  1 AS `empleado_nombre`,
  1 AS `especialidad`,
  1 AS `turnos_atendidos`,
  1 AS `total_generado`,
  1 AS `activo` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_servicios_populares`;
/*!50001 DROP VIEW IF EXISTS `v_servicios_populares`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_servicios_populares` AS SELECT
 1 AS `id`,
  1 AS `nombre`,
  1 AS `categoria`,
  1 AS `veces_reservado`,
  1 AS `total_generado` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_turnos_activos`;
/*!50001 DROP VIEW IF EXISTS `v_turnos_activos`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_turnos_activos` AS SELECT
 1 AS `id`,
  1 AS `id_cliente`,
  1 AS `id_empleado`,
  1 AS `fecha`,
  1 AS `hora`,
  1 AS `duracion_total`,
  1 AS `precio_total`,
  1 AS `estado`,
  1 AS `notas_turno`,
  1 AS `fecha_creacion`,
  1 AS `created_at`,
  1 AS `updated_at`,
  1 AS `deleted_at`,
  1 AS `cliente_nombre`,
  1 AS `cliente_telefono`,
  1 AS `empleado_nombre`,
  1 AS `especialidad_nombre` */;
SET character_set_client = @saved_cs_client;
DROP TABLE IF EXISTS `v_turnos_por_estado`;
/*!50001 DROP VIEW IF EXISTS `v_turnos_por_estado`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `v_turnos_por_estado` AS SELECT
 1 AS `estado`,
  1 AS `total`,
  1 AS `valor_total`,
  1 AS `minutos_total`,
  1 AS `porcentaje` */;
SET character_set_client = @saved_cs_client;

USE `spa_consultorio_db`;
/*!50001 DROP VIEW IF EXISTS `v_clientes_frecuentes`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_clientes_frecuentes` AS select `u`.`id` AS `cliente_id`,`u`.`nombre` AS `cliente_nombre`,`u`.`telefono` AS `telefono`,count(`t`.`id`) AS `total_visitas`,coalesce(sum(`t`.`precio_total`),0) AS `total_gastado`,max(`t`.`fecha`) AS `ultima_visita` from (`usuarios` `u` left join `turnos` `t` on(`t`.`id_cliente` = `u`.`id` and `t`.`estado` = 'atendido' and `t`.`deleted_at` is null)) where `u`.`rol` = 'cliente' and `u`.`deleted_at` is null group by `u`.`id`,`u`.`nombre`,`u`.`telefono` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_dashboard_resumen`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_dashboard_resumen` AS select (select count(0) from `turnos` where `turnos`.`deleted_at` is null and `turnos`.`estado` = 'pendiente' and `turnos`.`fecha` = curdate()) AS `pendientes_hoy`,(select count(0) from `turnos` where `turnos`.`deleted_at` is null and `turnos`.`estado` = 'confirmado' and `turnos`.`fecha` = curdate()) AS `confirmados_hoy`,(select count(0) from `turnos` where `turnos`.`deleted_at` is null and `turnos`.`estado` = 'atendido' and `turnos`.`fecha` = curdate()) AS `atendidos_hoy`,(select coalesce(sum(`c`.`monto_total`),0) from (`turnos` `t` join `cobros` `c` on(`c`.`id_turno` = `t`.`id`)) where `t`.`deleted_at` is null and `t`.`fecha` = curdate()) AS `facturado_hoy`,(select count(0) from `usuarios` where `usuarios`.`rol` = 'cliente' and `usuarios`.`deleted_at` is null and cast(`usuarios`.`fecha_registro` as date) between curdate() - interval 30 day and curdate()) AS `clientes_nuevos_mes` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_ingresos_diarios`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_ingresos_diarios` AS select cast(`t`.`fecha` as date) AS `dia`,count(`t`.`id`) AS `cantidad_turnos`,sum(`c`.`monto_total`) AS `total_facturado`,sum(`c`.`monto_adelanto`) AS `total_adelantos`,sum(case when `c`.`estado_pago` = 'pagado_completo' then `c`.`monto_total` else 0 end) AS `total_cobrado`,sum(case when `c`.`estado_pago` = 'reembolsado' then `c`.`monto_total` else 0 end) AS `total_reembolsado` from (`turnos` `t` join `cobros` `c` on(`c`.`id_turno` = `t`.`id`)) where `t`.`deleted_at` is null group by cast(`t`.`fecha` as date) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_ocupacion_diaria`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_ocupacion_diaria` AS select `e`.`id` AS `empleado_id`,`u`.`nombre` AS `empleado_nombre`,`t`.`fecha` AS `fecha`,count(`t`.`id`) AS `turnos_dia`,coalesce(sum(`t`.`duracion_total`),0) AS `minutos_ocupados`,coalesce(sum(time_to_sec(timediff(`d`.`hora_fin`,`d`.`hora_inicio`)) / 60),0) AS `minutos_disponibles` from (((`empleados` `e` join `usuarios` `u` on(`u`.`id` = `e`.`id_usuario`)) left join `turnos` `t` on(`t`.`id_empleado` = `e`.`id` and `t`.`deleted_at` is null and `t`.`estado` in ('pendiente','confirmado','atendido'))) left join `disponibilidad_empleados` `d` on(`d`.`id_empleado` = `e`.`id` and `d`.`activo` = 1 and `d`.`dia_semana` = elt(weekday(`t`.`fecha`) + 1,'lunes','martes','miercoles','jueves','viernes','sabado','domingo'))) where `e`.`deleted_at` is null group by `e`.`id`,`u`.`nombre`,`t`.`fecha` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_rendimiento_empleados`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_rendimiento_empleados` AS select `e`.`id` AS `empleado_id`,`u`.`nombre` AS `empleado_nombre`,`esp`.`nombre` AS `especialidad`,count(`t`.`id`) AS `turnos_atendidos`,coalesce(sum(`t`.`precio_total`),0) AS `total_generado`,`e`.`activo` AS `activo` from (((`empleados` `e` join `usuarios` `u` on(`u`.`id` = `e`.`id_usuario`)) left join `especialidades` `esp` on(`esp`.`id` = `e`.`id_especialidad`)) left join `turnos` `t` on(`t`.`id_empleado` = `e`.`id` and `t`.`estado` = 'atendido' and `t`.`deleted_at` is null)) where `e`.`deleted_at` is null group by `e`.`id`,`u`.`nombre`,`esp`.`nombre`,`e`.`activo` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_servicios_populares`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_servicios_populares` AS select `s`.`id` AS `id`,`s`.`nombre` AS `nombre`,`cat`.`nombre` AS `categoria`,count(`ts`.`id_turno`) AS `veces_reservado`,sum(`ts`.`precio_servicio`) AS `total_generado` from (((`servicios` `s` left join `categorias_servicios` `cat` on(`cat`.`id` = `s`.`id_categoria`)) left join `turnos_servicios` `ts` on(`ts`.`id_servicio` = `s`.`id`)) left join `turnos` `t` on(`t`.`id` = `ts`.`id_turno` and `t`.`deleted_at` is null and `t`.`estado` in ('atendido','confirmado'))) where `s`.`deleted_at` is null group by `s`.`id`,`s`.`nombre`,`cat`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_turnos_activos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_turnos_activos` AS select `t`.`id` AS `id`,`t`.`id_cliente` AS `id_cliente`,`t`.`id_empleado` AS `id_empleado`,`t`.`fecha` AS `fecha`,`t`.`hora` AS `hora`,`t`.`duracion_total` AS `duracion_total`,`t`.`precio_total` AS `precio_total`,`t`.`estado` AS `estado`,`t`.`notas_turno` AS `notas_turno`,`t`.`fecha_creacion` AS `fecha_creacion`,`t`.`created_at` AS `created_at`,`t`.`updated_at` AS `updated_at`,`t`.`deleted_at` AS `deleted_at`,`u_cli`.`nombre` AS `cliente_nombre`,`u_cli`.`telefono` AS `cliente_telefono`,`u_emp`.`nombre` AS `empleado_nombre`,`esp`.`nombre` AS `especialidad_nombre` from ((((`turnos` `t` join `usuarios` `u_cli` on(`u_cli`.`id` = `t`.`id_cliente`)) join `empleados` `e` on(`e`.`id` = `t`.`id_empleado`)) join `usuarios` `u_emp` on(`u_emp`.`id` = `e`.`id_usuario`)) left join `especialidades` `esp` on(`esp`.`id` = `e`.`id_especialidad`)) where `t`.`deleted_at` is null */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!50001 DROP VIEW IF EXISTS `v_turnos_por_estado`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = cp850 */;
/*!50001 SET character_set_results     = cp850 */;
/*!50001 SET collation_connection      = cp850_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_turnos_por_estado` AS select `turnos`.`estado` AS `estado`,count(0) AS `total`,sum(`turnos`.`precio_total`) AS `valor_total`,sum(`turnos`.`duracion_total`) AS `minutos_total`,round(count(0) * 100.0 / (select count(0) from `turnos` where `turnos`.`deleted_at` is null),1) AS `porcentaje` from `turnos` where `turnos`.`deleted_at` is null group by `turnos`.`estado` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

