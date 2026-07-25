
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `username`, `password`, `rol`, `telefono`, `fecha_nacimiento`, `sexo`, `avatar_url`, `fecha_registro`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'Administrador','admin@spagrace.com','admin','$2b$10$mna4eu4pdvuQcXPC0BVq6OZsXUu09wLdTGk9Ly4CWQGpciC0NXTmW','admin',NULL,NULL,NULL,NULL,'2026-07-25 15:15:16','2026-07-25 15:15:16','2026-07-25 15:15:16',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` (`id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`) VALUES (1,'Masoterapia','Especialista en masajes terap?uticos y relajantes',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(2,'Est?tica Facial','Especialista en tratamientos faciales',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(3,'Est?tica Corporal','Especialista en tratamientos corporales',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(4,'Cosmetolog?a','Especialista en cosm?tica y dermocosm?tica',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(5,'Naturolog?a','Especialista en terapias naturales y hol?sticas',1,'2026-07-25 15:15:16','2026-07-25 15:15:16');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `categorias_servicios` WRITE;
/*!40000 ALTER TABLE `categorias_servicios` DISABLE KEYS */;
INSERT INTO `categorias_servicios` (`id`, `nombre`, `descripcion`, `icono`, `orden`, `activo`, `created_at`, `updated_at`) VALUES (1,'Masajes','Masajes terap?uticos y descontracturantes','spa',1,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(2,'Faciales','Tratamientos faciales y limpieza de cutis','face',2,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(3,'Corporales','Tratamientos de reducci?n y modelado corporal','fitness_center',3,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(4,'Bienestar','Terapias hol?sticas y de bienestar general','self_care',4,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(5,'Depilaci?n','Servicios de depilaci?n','content_cut',5,1,'2026-07-25 15:15:16','2026-07-25 15:15:16');
/*!40000 ALTER TABLE `categorias_servicios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

