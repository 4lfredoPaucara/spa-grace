
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` (`id`, `id_usuario`, `direccion`, `ocupacion`, `como_conocio`, `alergias`, `notas_internas`, `created_at`, `updated_at`) VALUES (1,6,'Av. Corrientes 1234 5B, CABA','Docente','instagram','Ninguna conocida','Cliente VIP - Prefiere turnos matutinos','2026-07-26 06:43:54','2026-07-26 06:43:54'),(2,7,'Calle Florida 567, CABA','Contador','referido','Alergia al l?tex','Viene cada 15 d?as. Solo masajes relajantes.','2026-07-26 06:43:54','2026-07-26 06:43:54'),(3,8,'Av. Santa Fe 890 3A, CABA','Dise?adora Gr?fica','google','Piel sensible - evitar productos con alcohol','Interesada en tratamientos faciales.','2026-07-26 06:43:54','2026-07-26 06:43:54'),(4,9,'Calle Lavalle 234, CABA','Abogado','instagram','Ninguna conocida','Nuevo cliente. Primera sesi?n exploratoria.','2026-07-26 06:43:54','2026-07-26 06:43:54'),(5,10,'Av. C?rdoba 4567 PB, CABA','Estudiante','facebook','Asma leve','Cliente frecuente. Prefiere turnos vespertinos.','2026-07-26 06:43:54','2026-07-26 06:43:54');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` (`id`, `id_usuario`, `id_especialidad`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,2,1,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(2,3,3,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(3,4,2,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL);
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` (`id`, `id_categoria`, `nombre`, `descripcion`, `duracion`, `precio`, `tipo`, `parent_servicio_id`, `imagen_url`, `activo`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,1,'Masaje Descontracturante','Masaje terap?utico de tejido profundo. Ideal para contracturas y tensiones musculares cr?nicas.',60,4500.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(2,1,'Masaje Relajante','Masaje suave con movimientos largos y fluidos para reducir el estr?s.',45,3500.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(3,1,'Drenaje Linf?tico Manual','T?cnica de masaje suave que activa la circulaci?n linf?tica.',60,5000.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(4,2,'Limpieza de Cutis Profunda','Higiene facial profunda con extracci?n de impurezas, vapor y mascarilla.',45,3000.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(5,2,'Tratamiento Facial Anti-Edad','Protocolo antienvejecimiento con col?geno, ?cido hialur?nico y radiofrecuencia.',60,5500.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(6,3,'Reducci?n y Modelado Corporal','T?cnicas combinadas de ultracavitaci?n y masaje modelador.',60,5200.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(7,3,'Envoltura Corporal Detox','Envoltura con algas marinas y fangoterapia para desintoxicar la piel.',45,4000.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(8,4,'Reiki','Terapia de sanaci?n energ?tica mediante imposici?n de manos.',60,3800.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(9,4,'Reflexolog?a Podal','Masaje en puntos reflejos de los pies que estimula ?rganos y sistemas.',45,3200.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(10,5,'Depilaci?n Facial con Hilo','Depilaci?n precisa con t?cnica de hilo para cejas y rostro.',30,2500.00,'principal',NULL,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(11,1,'Piedras Calientes +','Terapia con piedras volc?nicas calientes para potenciar la relajaci?n muscular.',15,1200.00,'addon',1,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(12,1,'Aceites Esenciales +','Aceites esenciales personalizados: relajante, energizante o equilibrante.',0,800.00,'addon',1,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(13,1,'Aromaterapia +','Difusor de aromas + aceite esencial para una experiencia sensorial completa.',0,600.00,'addon',2,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(14,2,'Mascarilla de Col?geno +','Mascarilla de col?geno con efecto lifting inmediato.',15,1500.00,'addon',4,NULL,1,'2026-07-26 06:43:54','2026-07-26 06:43:54',NULL);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `empleados_servicios` WRITE;
/*!40000 ALTER TABLE `empleados_servicios` DISABLE KEYS */;
INSERT INTO `empleados_servicios` (`id_empleado`, `id_servicio`) VALUES (1,1),(1,2),(1,3),(1,8),(1,9),(1,11),(1,12),(1,13),(2,3),(2,6),(2,7),(3,4),(3,5),(3,10),(3,14);
/*!40000 ALTER TABLE `empleados_servicios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `disponibilidad_empleados` WRITE;
/*!40000 ALTER TABLE `disponibilidad_empleados` DISABLE KEYS */;
INSERT INTO `disponibilidad_empleados` (`id`, `id_empleado`, `dia_semana`, `hora_inicio`, `hora_fin`, `activo`, `created_at`, `updated_at`) VALUES (17,1,'lunes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(18,1,'martes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(19,1,'miercoles','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(20,1,'jueves','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(21,1,'viernes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(22,2,'lunes','14:00:00','20:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(23,2,'martes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(24,2,'miercoles','14:00:00','20:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(25,2,'jueves','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(26,2,'viernes','14:00:00','20:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(27,2,'sabado','09:00:00','14:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(28,3,'martes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(29,3,'miercoles','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(30,3,'jueves','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(31,3,'viernes','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54'),(32,3,'sabado','09:00:00','18:00:00',1,'2026-07-26 06:43:54','2026-07-26 06:43:54');
/*!40000 ALTER TABLE `disponibilidad_empleados` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` (`id`, `id_cliente`, `id_empleado`, `fecha`, `hora`, `duracion_total`, `precio_total`, `estado`, `notas_turno`, `fecha_creacion`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,6,1,'2026-07-20','10:00:00',60,4500.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(2,7,2,'2026-07-21','15:00:00',60,5000.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(3,8,3,'2026-07-22','11:00:00',45,3000.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(4,9,1,'2026-07-22','14:00:00',75,5700.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(5,10,2,'2026-07-23','16:00:00',60,5200.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(6,6,3,'2026-07-23','09:00:00',75,7000.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(7,7,1,'2026-07-24','10:00:00',45,3500.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(8,8,2,'2026-07-24','15:00:00',60,5000.00,'atendido',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(9,9,1,'2026-07-27','10:00:00',60,4500.00,'confirmado',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(10,6,3,'2026-07-28','11:00:00',60,5500.00,'confirmado',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(11,10,2,'2026-07-29','15:00:00',60,5200.00,'confirmado',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(12,7,1,'2026-07-28','15:00:00',45,3200.00,'pendiente',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(13,8,3,'2026-07-29','09:00:00',45,3000.00,'pendiente',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(14,6,2,'2026-07-30','16:00:00',45,4000.00,'pendiente',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(15,9,2,'2026-07-28','09:00:00',60,5000.00,'cancelado',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL),(16,10,1,'2026-07-24','16:00:00',60,4500.00,'cancelado',NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26','2026-07-26 06:44:26',NULL);
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `turnos_servicios` WRITE;
/*!40000 ALTER TABLE `turnos_servicios` DISABLE KEYS */;
INSERT INTO `turnos_servicios` (`id_turno`, `id_servicio`, `precio_servicio`) VALUES (1,1,4500.00),(2,3,5000.00),(3,4,3000.00),(4,1,4500.00),(4,11,1200.00),(5,6,5200.00),(6,5,5500.00),(6,14,1500.00),(7,2,3500.00),(8,3,5000.00),(9,1,4500.00),(10,5,5500.00),(11,6,5200.00),(12,9,3200.00),(13,4,3000.00),(14,7,4000.00),(15,3,5000.00),(16,1,4500.00);
/*!40000 ALTER TABLE `turnos_servicios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `cobros` WRITE;
/*!40000 ALTER TABLE `cobros` DISABLE KEYS */;
INSERT INTO `cobros` (`id`, `id_turno`, `monto_total`, `monto_adelanto`, `monto_pendiente`, `metodo_pago_adelanto`, `metodo_pago_final`, `fecha_adelanto`, `fecha_cobro_final`, `estado_pago`, `promocion_aplicada`, `notas`, `created_at`, `updated_at`) VALUES (1,1,4500.00,2000.00,2500.00,'transferencia','efectivo','2026-07-19 10:00:00','2026-07-20 11:00:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(2,2,5000.00,2500.00,2500.00,'efectivo','efectivo','2026-07-20 12:00:00','2026-07-21 15:45:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(3,3,3000.00,0.00,3000.00,NULL,'tarjeta',NULL,'2026-07-22 11:45:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(4,4,5700.00,3000.00,2700.00,'transferencia','transferencia','2026-07-21 09:00:00','2026-07-22 15:15:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(5,5,5200.00,2000.00,3200.00,'tarjeta','tarjeta','2026-07-22 14:00:00','2026-07-23 17:00:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(6,6,7000.00,3500.00,3500.00,'efectivo','efectivo','2026-07-22 08:00:00','2026-07-23 10:00:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(7,7,3500.00,0.00,3500.00,NULL,'efectivo',NULL,'2026-07-24 10:45:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(8,8,5000.00,2500.00,2500.00,'transferencia','transferencia','2026-07-23 10:00:00','2026-07-24 16:00:00','pagado_completo',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(9,9,4500.00,2000.00,2500.00,'efectivo',NULL,'2026-07-26 10:00:00',NULL,'adelanto_pagado',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(10,10,5500.00,2500.00,3000.00,'transferencia',NULL,'2026-07-25 15:00:00',NULL,'adelanto_pagado',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(11,11,5200.00,2000.00,3200.00,'tarjeta',NULL,'2026-07-26 09:00:00',NULL,'adelanto_pagado',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(12,12,3200.00,0.00,3200.00,NULL,NULL,NULL,NULL,'pendiente_adelanto',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(13,13,3000.00,0.00,3000.00,NULL,NULL,NULL,NULL,'pendiente_adelanto',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(14,14,4000.00,0.00,4000.00,NULL,NULL,NULL,NULL,'pendiente_adelanto',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(15,15,5000.00,2500.00,2500.00,'efectivo',NULL,'2026-07-27 09:00:00',NULL,'cancelado',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26'),(16,16,4500.00,2000.00,2500.00,'transferencia',NULL,'2026-07-23 14:00:00',NULL,'reembolsado',NULL,NULL,'2026-07-26 06:44:26','2026-07-26 06:44:26');
/*!40000 ALTER TABLE `cobros` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `pagos_empleados` WRITE;
/*!40000 ALTER TABLE `pagos_empleados` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos_empleados` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `historiales_clinicos` WRITE;
/*!40000 ALTER TABLE `historiales_clinicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `historiales_clinicos` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `promociones` WRITE;
/*!40000 ALTER TABLE `promociones` DISABLE KEYS */;
/*!40000 ALTER TABLE `promociones` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` (`id`, `id_usuario`, `token`, `expires_at`, `created_at`) VALUES (1,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTAxODA0NCwiZXhwIjoxNzg1NjIyODQ0fQ.yv3taSPLIRl9SsdAS9SiS4xAoOEg65Ifhy__sNG-TWw','2026-08-01 22:20:44','2026-07-25 22:20:44'),(2,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTAyNDQ4MiwiZXhwIjoxNzg1NjI5MjgyfQ.qsuIldieCEFJ8_CBBWmGyeFqTxNDgtmuvZAyvMfNmik','2026-08-02 00:08:02','2026-07-26 00:08:02'),(3,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTAzMDY1OCwiZXhwIjoxNzg1NjM1NDU4fQ.OmaUxwilgGZCvfyPL08qc0-H3ZXSejSp7c-425zspGA','2026-08-02 01:50:58','2026-07-26 01:50:58'),(4,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTA0NzE3NSwiZXhwIjoxNzg1NjUxOTc1fQ.MDD24m-lxIpuFEDNMKp6UMXgMSKvxB5bD58rCvZi2R8','2026-08-02 06:26:15','2026-07-26 06:26:15'),(5,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTA0NzM5OCwiZXhwIjoxNzg1NjUyMTk4fQ.I4yIP7M7plwSYxp-CTtQ0-qDB_nuulhrju744jF4qes','2026-08-02 06:29:58','2026-07-26 06:29:58'),(6,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2wiOiJhZG1pbiIsImlhdCI6MTc4NTA0NzYwNywiZXhwIjoxNzg1NjUyNDA3fQ.MwPQCFPw0i9Mt_H25l1_oIuzGHWHmotgIcuF0N7B1ac','2026-08-02 06:33:27','2026-07-26 06:33:27');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

