-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: db
-- Tiempo de generación: 30-05-2025 a las 09:33:47
-- Versión del servidor: 8.0.39
-- Versión de PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `recetario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `receta_id` int NOT NULL,
  `usuario_id` bigint UNSIGNED NOT NULL,
  `fecha_favorito` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`receta_id`, `usuario_id`, `fecha_favorito`) VALUES
(61, 4, '2025-05-29 16:53:42'),
(62, 4, '2025-05-29 16:53:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `IngredientesPrincipales`
--

CREATE TABLE `IngredientesPrincipales` (
  `ingrediente_id` int NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Categoria` varchar(50) DEFAULT NULL,
  `Fecha_de_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `Estado` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `IngredientesPrincipales`
--

INSERT INTO `IngredientesPrincipales` (`ingrediente_id`, `Nombre`, `Descripcion`, `Categoria`, `Fecha_de_creacion`, `Estado`) VALUES
(1, 'Harina de trigo', NULL, 'Cereales', '2025-05-08 14:07:16', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `PASOS`
--

CREATE TABLE `PASOS` (
  `orden` int NOT NULL,
  `descripcion` varchar(5000) NOT NULL,
  `ingrediente` varchar(100) DEFAULT NULL,
  `cantidad` float DEFAULT NULL,
  `unidad_medida` varchar(100) DEFAULT NULL,
  `tipo` varchar(100) NOT NULL,
  `duracion` float NOT NULL,
  `necesario` tinyint(1) NOT NULL,
  `receta_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `PASOS`
--

INSERT INTO `PASOS` (`orden`, `descripcion`, `ingrediente`, `cantidad`, `unidad_medida`, `tipo`, `duracion`, `necesario`, `receta_id`) VALUES
(1, 'sfbgfgb', 'dfgh', 100, 'g', 'preparación', 5, 1, 73),
(1, 'prueba pasos', '', NULL, '', 'preparación', 5, 1, 82),
(2, 'Paso de prueba 2', '', NULL, '', 'mezcla', 5, 1, 73),
(3, 'Prueba 3 redireccion a detalle', '', NULL, '', 'preparación', 5, 0, 73),
(4, 'detalle detallado', '', NULL, '', 'preparación', 5, 1, 73);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `RECETA`
--

CREATE TABLE `RECETA` (
  `receta_id` int NOT NULL,
  `usuario_id` bigint UNSIGNED NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `imagen` varchar(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT 'Descripción no disponible',
  `tiempo_preparacion` int DEFAULT NULL,
  `tiempo_coccion` int DEFAULT NULL,
  `tiempo_total` int DEFAULT NULL,
  `dificultad` varchar(255) DEFAULT NULL,
  `fecha_creacion` varchar(255) DEFAULT NULL,
  `fecha_publicacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `origen` varchar(255) DEFAULT NULL,
  `video_instrucciones` varchar(255) DEFAULT NULL,
  `valoracion_media` decimal(3,2) DEFAULT NULL,
  `numero_valoraciones` int DEFAULT NULL,
  `comentarios` text,
  `publica` tinyint(1) DEFAULT '1',
  `categoria` varchar(255) DEFAULT NULL,
  `autor` varchar(255) DEFAULT NULL,
  `porciones` int DEFAULT NULL,
  `calorias_totales` int DEFAULT NULL,
  `numvistas` int DEFAULT '0',
  `numfavoritos` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `RECETA`
--

INSERT INTO `RECETA` (`receta_id`, `usuario_id`, `nombre`, `imagen`, `descripcion`, `tiempo_preparacion`, `tiempo_coccion`, `tiempo_total`, `dificultad`, `fecha_creacion`, `fecha_publicacion`, `origen`, `video_instrucciones`, `valoracion_media`, `numero_valoraciones`, `comentarios`, `publica`, `categoria`, `autor`, `porciones`, `calorias_totales`, `numvistas`, `numfavoritos`) VALUES
(61, 3, 'Prueba 1', NULL, 'Descripción no disponible', NULL, NULL, NULL, NULL, NULL, '2025-05-02 10:53:05', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 0, 0),
(62, 1, 'Ensalada César', 'ensalada_cesar.jpg', 'Una deliciosa ensalada con aderezo César', 15, 0, 15, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Italia', NULL, 4.50, 10, 'Fresca y deliciosa', 1, 'Entrada', 'Chef A', 2, 150, 5, 2),
(63, 2, 'Paella Valenciana', 'paella_valenciana.jpg', 'Un clásico plato español con mariscos y arroz', 20, 40, 60, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'España', NULL, 4.80, 25, 'Perfecta para compartir', 1, 'Plato fuerte', 'Chef B', 4, 600, 10, 5),
(64, 3, 'Tarta de Queso', 'tarta_queso.jpg', 'Postre cremoso y delicioso', 15, 30, 45, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Estados Unidos', NULL, 4.70, 18, 'Ideal para los amantes del queso', 1, 'Postre', 'Chef C', 8, 400, 8, 3),
(66, 1, 'Sopa de Tomate', 'sopa_tomate.jpg', 'Sopa ligera y saludable', 10, 10, 20, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'España', NULL, 4.30, 8, 'Perfecta para días fríos', 1, 'Entrada', 'Chef E', 4, 100, 6, 1),
(67, 2, 'Pollo al Curry', 'pollo_curry.jpg', 'Pollo con una mezcla de especias y leche de coco', 20, 20, 40, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'India', NULL, 4.90, 30, 'Exótico y sabroso', 1, 'Plato fuerte', 'Chef F', 4, 700, 15, 6),
(68, 3, 'Hamburguesa Clásica', 'hamburguesa_clasica.jpg', 'Hamburguesa con carne, queso y vegetales', 10, 15, 25, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Estados Unidos', NULL, 4.40, 12, 'Un clásico que nunca falla', 1, 'Plato fuerte', 'Chef G', 1, 800, 20, 8),
(69, 4, 'Lasaña de Carne', 'lasagna_carne.jpg', 'Capas de pasta, carne y queso gratinado', 20, 30, 50, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'Italia', NULL, 4.70, 22, 'Ideal para reuniones familiares', 1, 'Plato fuerte', 'Chef H', 6, 900, 18, 7),
(70, 1, 'Ceviche de Pescado', 'ceviche_pescado.jpg', 'Pescado marinado en jugo de limón', 15, 0, 15, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'Perú', NULL, 4.80, 20, 'Fresco y saludable', 1, 'Entrada', 'Chef I', 4, 200, 10, 5),
(71, 2, 'Brownies de Chocolate', 'brownies_chocolate.jpg', 'Postre de chocolate húmedo y delicioso', 10, 30, 40, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Estados Unidos', NULL, 4.90, 28, 'Perfecto para los amantes del chocolate', 1, 'Postre', 'Chef J', 8, 450, 25, 10),
(72, 3, 'Tacos al Pastor', 'tacos_pastor.jpg', 'Tacos con carne marinada y piña', 15, 15, 30, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'México', NULL, 4.60, 18, 'Un sabor auténtico mexicano', 1, 'Plato fuerte', 'Chef K', 4, 500, 12, 4),
(73, 4, 'Risotto de Champiñones', 'https://imgs.search.brave.com/-JzxNnhUrVYWY6gXgqxYg3Ylsdxju0Q2t-ZXdfyfBRg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vWl9pb2F5/UG1KZEhCbm9pMkJE/TElHd0hnNUZWOGxi/SWJFdW9hYkRMczJp/cy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldGbi9aWE11Y0dW/NFpXeHpMbU52L2JT/OXdhRzkwYjNNdk5q/azAvT1RJM01pOXda/WGhsYkhNdC9jR2h2/ZEc4dE5qazBPVEkz/L01pNXFjR1ZuUDJG/MWRHODkvWTI5dGNI/SmxjM01tWTNNOS9k/R2x1ZVhOeVoySW1a/SEJ5L1BURW1kejAx/TURB', 'Arroz cremoso con champiñones', 15, 30, 45, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'Italia', 'https://www.youtube.com/watch?v=D2KE2a5qo0g&list=RDCLAK5uy_mfdqvCAl8wodlx2P2_Ai2gNkiRDAufkkI&index=27', 4.70, 20, 'Cremoso y delicioso', 1, 'Plato fuerte', 'Chef L', 4, 600, 10, 3),
(74, 1, 'Gazpacho Andaluz', 'gazpacho_andaluz.jpg', 'Sopa fría de tomate y vegetales', 10, 0, 10, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'España', NULL, 4.50, 12, 'Refrescante y saludable', 1, 'Entrada', 'Chef M', 4, 150, 8, 2),
(75, 2, 'Croquetas de Jamón', 'croquetas_jamon.jpg', 'Croquetas crujientes con jamón', 20, 40, 60, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'España', NULL, 4.80, 25, 'Un clásico español', 1, 'Entrada', 'Chef N', 6, 300, 15, 6),
(76, 3, 'Pasta Carbonara', 'pasta_carbonara.jpg', 'Pasta con salsa de huevo, queso y panceta', 10, 10, 20, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Italia', NULL, 4.60, 18, 'Rápida y deliciosa', 1, 'Plato fuerte', 'Chef O', 2, 400, 12, 4),
(77, 4, 'Empanadas de Carne', 'empanadas_carne.jpg', 'Empanadas rellenas de carne sazonada', 20, 30, 50, 'Media', '2025-05-01', '2025-05-01 00:00:00', 'Argentina', NULL, 4.70, 22, 'Perfectas para compartir', 1, 'Entrada', 'Chef P', 4, 500, 10, 3),
(78, 1, 'Sushi Variado', 'sushi_variado.jpg', 'Selección de sushi fresco', 30, 60, 90, 'Difícil', '2025-05-01', '2025-05-01 00:00:00', 'Japón', NULL, 4.90, 30, 'Un arte culinario', 1, 'Plato fuerte', 'Chef Q', 2, 300, 20, 8),
(79, 2, 'Churros con Chocolate', 'churros_chocolate.jpg', 'Churros fritos con chocolate caliente', 10, 20, 30, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'España', NULL, 4.80, 25, 'Un postre irresistible', 1, 'Postre', 'Chef R', 4, 400, 18, 7),
(80, 3, 'Pollo Asado', 'pollo_asado.jpg', 'Pollo al horno con especias', 20, 50, 70, 'Fácil', '2025-05-01', '2025-05-01 00:00:00', 'Global', NULL, 4.70, 22, 'Jugoso y delicioso', 1, 'Plato fuerte', 'Chef S', 6, 800, 15, 6),
(82, 4, 'Prueba22', 'safdbs', 'asfvadf', 23, NULL, NULL, 'Fácil', '2025-05-06', '2025-05-06 12:50:08', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, 0, 0),
(83, 4, 'Prueba 333', 'sdfgb', 'dgh', 345, 45, 354, 'Media', '2025-05-06', '2025-05-06 12:56:36', NULL, NULL, NULL, NULL, NULL, 1, 'Postre', NULL, 5, 3566, 0, 0),
(84, 4, 'prueba44', 'safdbs', 'sfgd', 435, 242, 234, 'Fácil', '2025-05-06', '2025-05-06 12:58:40', NULL, NULL, NULL, NULL, NULL, 1, 'Plato principal', NULL, 5, 24, 0, 0),
(85, 4, 'pruebaaaaa', 'sdbsv', 'asfdgsh', 45, 45, 45, 'Media', '2025-05-08', '2025-05-08 08:01:01', NULL, NULL, NULL, NULL, NULL, 1, 'Plato principal', NULL, 3, 35, 0, 0),
(86, 5, 'pruebas definitivas', 'sdbsdbsf', 'fddcgncv', 2345, 45, 45, 'Fácil', '2025-05-08', '2025-05-08 08:35:43', NULL, NULL, NULL, NULL, NULL, 1, 'Postre', NULL, 6, 45, 0, 0),
(87, 4, 'pruebas 444', 'sdfdbd', 'dfbsd', 345, 45, 454, 'Media', '2025-05-13', '2025-05-13 07:39:13', NULL, NULL, NULL, NULL, NULL, 1, 'Postre', NULL, 6, 2345, 0, 0),
(91, 4, 'aeiou', 'fgbvcn', 'dfxbcnv', 45, 243, 4576, 'Media', '2025-05-13', '2025-05-13 09:15:11', '', '', NULL, NULL, NULL, 1, 'Plato principal', NULL, 6, 467, 0, 0),
(92, 4, 'prueba ingredientes', 'aeiou', 'sadfgvc', 65786, 6868, 78799, 'Media', '2025-05-14', '2025-05-14 08:13:31', NULL, NULL, NULL, NULL, NULL, 1, 'Plato principal', NULL, 3, 234, 0, 0),
(93, 4, 'prueba ingredientes222', 'fghj', 'dhfj', 46, 57, 5, 'Fácil', '2025-05-14', '2025-05-14 08:18:29', '', '', NULL, NULL, NULL, 1, 'Plato principal', NULL, 4, 6, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Recetas_Ingredientes`
--

CREATE TABLE `Recetas_Ingredientes` (
  `id` int NOT NULL,
  `receta_id` int NOT NULL,
  `ingrediente_id` int NOT NULL,
  `Cantidad` varchar(50) DEFAULT NULL,
  `Unidad` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Recetas_Ingredientes`
--

INSERT INTO `Recetas_Ingredientes` (`id`, `receta_id`, `ingrediente_id`, `Cantidad`, `Unidad`) VALUES
(16, 93, 1, '23', 'Gramo (g)'),
(17, 91, 1, '123', 'Cucharadita'),
(39, 73, 1, '100', 'Gramo (g)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `REPORTES`
--

CREATE TABLE `REPORTES` (
  `report_id` int NOT NULL,
  `usuario_id` bigint UNSIGNED NOT NULL,
  `receta_id` int NOT NULL,
  `motivo` varchar(255) NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Seguidores`
--

CREATE TABLE `Seguidores` (
  `usuario_seguidor_id` bigint UNSIGNED NOT NULL,
  `usuario_seguido_id` bigint UNSIGNED NOT NULL,
  `fecha_seguimiento` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `Seguidores`
--

INSERT INTO `Seguidores` (`usuario_seguidor_id`, `usuario_seguido_id`, `fecha_seguimiento`) VALUES
(4, 1, '2025-05-27 19:31:42'),
(4, 3, '2025-05-27 06:57:35'),
(4, 5, '2025-05-21 08:09:02'),
(4, 6, '2025-05-21 09:49:48');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario_id` bigint UNSIGNED NOT NULL,
  `Nombre_de_usuario` varchar(50) DEFAULT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  `Apellidos` varchar(100) DEFAULT NULL,
  `Gmail` varchar(255) DEFAULT NULL,
  `Contrasena` varchar(255) DEFAULT NULL,
  `Foto_de_perfil` text,
  `Preferencias_de_contenido` text,
  `Modo_oscuro_claro` tinyint(1) DEFAULT '0',
  `Rol` varchar(50) DEFAULT 'usuario',
  `Pais` varchar(100) DEFAULT NULL,
  `Lenguaje_de_preferencia` varchar(5) DEFAULT NULL,
  `Fecha_de_creacion` datetime DEFAULT NULL,
  `Tipo_de_cuenta` varchar(20) DEFAULT NULL,
  `Empresa_Organizacion` varchar(255) DEFAULT NULL,
  `Aceptacion_TYC` tinyint(1) DEFAULT NULL,
  `Aceptacion_Politica` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario_id`, `Nombre_de_usuario`, `Nombre`, `Apellidos`, `Gmail`, `Contrasena`, `Foto_de_perfil`, `Preferencias_de_contenido`, `Modo_oscuro_claro`, `Rol`, `Pais`, `Lenguaje_de_preferencia`, `Fecha_de_creacion`, `Tipo_de_cuenta`, `Empresa_Organizacion`, `Aceptacion_TYC`, `Aceptacion_Politica`) VALUES
(1, 'nuevo_usuario', 'Nombre de Ejemplo', 'Apellido Ejemplo', 'usuario@ejemplo.com', '$2b$10$5acLWqVQWmqBxjzDRe53xe98r7tWneIMQW/5xKMYeihOK.2Ui4eGu', NULL, NULL, 0, 'usuario', NULL, NULL, '2025-04-03 11:44:39', NULL, NULL, NULL, NULL),
(2, 'usuario_completo', 'NombreCompleto', 'ApellidoCompleto', 'completo@ejemplo.com', '$2b$10$mMLgPRqVjBk1gr4Bklm/tuMz9RMUttiLpF/n0uwKc3sTdjENzHrOS', 'https://miservidor.com/imagenes/usuario_completo.jpg', 'tecnologia, gastronomia, deportes', 1, 'usuario', 'España', 'es', '2025-04-03 11:47:45', 'personal', NULL, 1, 1),
(3, 'angel', 'angel', 'gallego', 'angel@gmail.com', '$2b$10$kEb1lDUu3m9a2R.vDdsur.BppdPhhRJvY4AIuE5lXAh8R49oGwvve', NULL, NULL, 0, 'admin', NULL, NULL, '2025-04-22 10:09:14', NULL, NULL, 1, 1),
(4, 'angel22', 'NombreCompleto', 'ApellidoCompleto', 'angel22@gmail.com', '$2b$10$/B2iG03UvevPAGTHJ5ILb.pWBe8Ll6s2YpLm4Gr/xQN6rLKT1BQUS', 'https://imgs.search.brave.com/Mp1fEC3NTqve3hSD-7Ue43OIshAdoZaox_YDuppsSwU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWdz/LnNlYXJjaC5icmF2/ZS5jb20vWlQ0My13/ZnlxeDk1RTROVFNy/ekdFMmJUUW9pZFBM/LWdPbHg4N3BpeklE/Zy9yczpmaXQ6NTAw/OjA6MDowL2c6Y2Uv/YUhSMGNITTZMeTlw/YldjdS9abkpsWlhC/cGF5NWpiMjB2L1pt/OTBieTFuY21GMGFY/TXYvY21WMGNtRjBi/eTFvYjIxaS9jbVV0/WlhOMGFXeHZMV1Jw/L1luVnFiM010WVc1/cGJXRmsvYjNOZk1q/TXRNakUxTVRFei9O/REUxTVM1cWNHY19j/MlZ0L2REMWhhWE5m/YUhsaWNtbGs', '', 1, 'usuario', 'España', 'es', '2025-04-29 07:46:37', 'personal', '', 1, 1),
(5, 'marta222', 'martita', 'gg', 'marta@gmail.com', '$2b$10$CZm/tcVdrMpSlgnPkXkI4uFLrn.ebh/1anCmRWB9mJnbHzd5063oy', NULL, NULL, 0, 'usuario', 'España', NULL, '2025-05-08 08:32:53', NULL, NULL, 1, 1),
(6, 'Usuario1', 'usuario1', '111', 'usuario1@gmail.com', '$2b$10$mgpnSuSSlrTrsl3UUzWaPOI7L8UCAyeas8G.pL0E5j0KErS9G.oz6', NULL, NULL, 0, 'usuario', NULL, NULL, '2025-05-19 09:41:17', NULL, NULL, 1, 1),
(7, 'usuario2', 'usuario2', 'usuario2', 'usuario2@gmail.com', '$2b$10$4EJFgWIULXMd75sTDMVzE.ZuBhdUMoIAZ6oZ7jS5V61i305LLfU/y', NULL, NULL, 0, 'usuario', NULL, NULL, '2025-05-19 09:42:02', NULL, NULL, 1, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`receta_id`,`usuario_id`),
  ADD KEY `fk_favoritos_receta` (`receta_id`),
  ADD KEY `fk_favoritos_usuario` (`usuario_id`),
  ADD KEY `idx_favoritos_usuario` (`usuario_id`),
  ADD KEY `idx_favoritos_receta` (`receta_id`),
  ADD KEY `idx_favoritos_fecha` (`fecha_favorito`);

--
-- Indices de la tabla `IngredientesPrincipales`
--
ALTER TABLE `IngredientesPrincipales`
  ADD PRIMARY KEY (`ingrediente_id`),
  ADD UNIQUE KEY `Nombre` (`Nombre`);

--
-- Indices de la tabla `PASOS`
--
ALTER TABLE `PASOS`
  ADD PRIMARY KEY (`orden`,`receta_id`),
  ADD KEY `fk_pasos_receta` (`receta_id`);

--
-- Indices de la tabla `RECETA`
--
ALTER TABLE `RECETA`
  ADD PRIMARY KEY (`receta_id`),
  ADD KEY `fk_usuario_id` (`usuario_id`);

--
-- Indices de la tabla `Recetas_Ingredientes`
--
ALTER TABLE `Recetas_Ingredientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `receta_id` (`receta_id`),
  ADD KEY `ingrediente_id` (`ingrediente_id`);

--
-- Indices de la tabla `REPORTES`
--
ALTER TABLE `REPORTES`
  ADD PRIMARY KEY (`report_id`,`usuario_id`,`receta_id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `receta_id` (`receta_id`);

--
-- Indices de la tabla `Seguidores`
--
ALTER TABLE `Seguidores`
  ADD PRIMARY KEY (`usuario_seguidor_id`,`usuario_seguido_id`),
  ADD KEY `fk_seguido_usuarios` (`usuario_seguido_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario_id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`),
  ADD UNIQUE KEY `Nombre_de_usuario` (`Nombre_de_usuario`),
  ADD UNIQUE KEY `Gmail` (`Gmail`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `IngredientesPrincipales`
--
ALTER TABLE `IngredientesPrincipales`
  MODIFY `ingrediente_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `RECETA`
--
ALTER TABLE `RECETA`
  MODIFY `receta_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT de la tabla `Recetas_Ingredientes`
--
ALTER TABLE `Recetas_Ingredientes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `REPORTES`
--
ALTER TABLE `REPORTES`
  MODIFY `report_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usuario_id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `fk_favoritos_receta` FOREIGN KEY (`receta_id`) REFERENCES `RECETA` (`receta_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_favoritos_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `PASOS`
--
ALTER TABLE `PASOS`
  ADD CONSTRAINT `fk_pasos_receta` FOREIGN KEY (`receta_id`) REFERENCES `RECETA` (`receta_id`);

--
-- Filtros para la tabla `RECETA`
--
ALTER TABLE `RECETA`
  ADD CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`);

--
-- Filtros para la tabla `Recetas_Ingredientes`
--
ALTER TABLE `Recetas_Ingredientes`
  ADD CONSTRAINT `Recetas_Ingredientes_ibfk_1` FOREIGN KEY (`receta_id`) REFERENCES `RECETA` (`receta_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Recetas_Ingredientes_ibfk_2` FOREIGN KEY (`ingrediente_id`) REFERENCES `IngredientesPrincipales` (`ingrediente_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `REPORTES`
--
ALTER TABLE `REPORTES`
  ADD CONSTRAINT `REPORTES_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `REPORTES_ibfk_2` FOREIGN KEY (`receta_id`) REFERENCES `RECETA` (`receta_id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Seguidores`
--
ALTER TABLE `Seguidores`
  ADD CONSTRAINT `fk_seguido_usuarios` FOREIGN KEY (`usuario_seguido_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_seguidor_usuarios` FOREIGN KEY (`usuario_seguidor_id`) REFERENCES `usuarios` (`usuario_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
