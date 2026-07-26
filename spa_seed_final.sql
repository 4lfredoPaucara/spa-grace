
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
INSERT INTO `usuarios` (`id`, `nombre`, `email`, `username`, `password`, `rol`, `telefono`, `fecha_nacimiento`, `sexo`, `avatar_url`, `fecha_registro`, `created_at`, `updated_at`, `deleted_at`) VALUES (1,'Administrador','admin@spagrace.com','admin','$2b$10$mna4eu4pdvuQcXPC0BVq6OZsXUu09wLdTGk9Ly4CWQGpciC0NXTmW','admin',NULL,NULL,NULL,NULL,'2026-07-25 15:15:16','2026-07-25 15:15:16','2026-07-25 15:15:16',NULL),(2,'Ana G?mez','ana@spagrace.com','anagomez','$2b$10$BNAGb5RQcqzHi/vcjERUceAn0UoNzeuCXHhKbzAeZkdUYj/cgy0dO','terapeuta','+5491123456790',NULL,'Femenino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(3,'Carlos Ruiz','carlos@spagrace.com','carlosruiz','$2b$10$0Zx1oMKokswOgow0sExhk.O9JS3mzVGqi0CqQfzVBPE3JFqBairu.','terapeuta','+5491123456791',NULL,'Masculino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(4,'Laura D?az','laura@spagrace.com','lauradiaz','$2b$10$HaKhIC2kQjQXGyHOUL8BgefyfDLitm.tySmsBaSze6i1ZRLvAzldK','terapeuta','+5491123456792',NULL,'Femenino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(5,'Pedro S?nchez','pedro@spagrace.com','pedrosanchez','$2b$10$bZOQPwLKPL4z/EWV/iL2MOFMjrQCzTsjNtC64JPhQpvESyR3tZ/xq','recepcionista','+5491123456793',NULL,'Masculino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(6,'Mar?a Garc?a','maria@email.com','mariagarcia','$2b$10$iEmH.eImrDQqCXA3VGa1ReXM7uVNfjRznslNwt8XcZav8bhR1POoG','cliente','+5491123456801','1990-03-15','Femenino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(7,'Juan L?pez','juan@email.com','juanlopez','$2b$10$tBpBtAohE8JV3mtCPuBeou./w1u7tX9Xrr2Nt3coRWe0X.zJaO1Xa','cliente','+5491123456802','1985-07-22','Masculino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(8,'Sof?a Mart?nez','sofia@email.com','sofiamartinez','$2b$10$TTkezowOR50bGvY/Ts5xQuaGKh1t9w9VABFgPz8NfPleR35HheXJ6','cliente','+5491123456803','1995-11-08','Femenino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(9,'Diego Fern?ndez','diego@email.com','diegofernandez','$2b$10$K0SKXp0fJQYpMfZMfbNBd.cSge2VtKLjWwB1yi8YNLX7CVBWLKuPa','cliente','+5491123456804','1988-01-30','Masculino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL),(10,'Valentina Rossi','valentina@email.com','valerossi','$2b$10$UiqkfEygnPuAYhg/1Vx8seDxjHRZW.x3vvta9/LdlCrk9rHgOc4tm','cliente','+5491123456805','2000-06-12','Femenino',NULL,'2026-07-26 06:43:54','2026-07-26 06:43:54','2026-07-26 06:43:54',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `especialidades` WRITE;
/*!40000 ALTER TABLE `especialidades` DISABLE KEYS */;
INSERT INTO `especialidades` (`id`, `nombre`, `descripcion`, `activo`, `created_at`, `updated_at`) VALUES (1,'Masoterapia','Especialista en masajes terap?uticos y relajantes',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(2,'Est?tica Facial','Especialista en tratamientos faciales',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(3,'Est?tica Corporal','Especialista en tratamientos corporales',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(4,'Cosmetolog?a','Especialista en cosm?tica y dermocosm?tica',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(5,'Naturolog?a','Especialista en terapias naturales y hol?sticas',1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(6,'Est├®tica Facial','Especialista en tratamientos faciales',1,'2026-07-25 16:13:02','2026-07-25 16:13:02'),(7,'Est├®tica Corporal','Especialista en tratamientos corporales',1,'2026-07-25 16:13:02','2026-07-25 16:13:02'),(8,'Cosmetolog├¡a','Especialista en cosm├®tica y dermocosm├®tica',1,'2026-07-25 16:13:02','2026-07-25 16:13:02'),(9,'Naturolog├¡a','Especialista en terapias naturales y hol├¡sticas',1,'2026-07-25 16:13:02','2026-07-25 16:13:02');
/*!40000 ALTER TABLE `especialidades` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `categorias_servicios` WRITE;
/*!40000 ALTER TABLE `categorias_servicios` DISABLE KEYS */;
INSERT INTO `categorias_servicios` (`id`, `nombre`, `descripcion`, `icono`, `orden`, `activo`, `created_at`, `updated_at`) VALUES (1,'Masajes','Masajes terap?uticos y descontracturantes','spa',1,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(2,'Faciales','Tratamientos faciales y limpieza de cutis','face',2,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(3,'Corporales','Tratamientos de reducci?n y modelado corporal','fitness_center',3,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(4,'Bienestar','Terapias hol?sticas y de bienestar general','self_care',4,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(5,'Depilaci?n','Servicios de depilaci?n','content_cut',5,1,'2026-07-25 15:15:16','2026-07-25 15:15:16'),(6,'Depilaci├│n','Servicios de depilaci├│n','content_cut',5,1,'2026-07-25 16:13:02','2026-07-25 16:13:02');
/*!40000 ALTER TABLE `categorias_servicios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

