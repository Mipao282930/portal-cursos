CREATE DATABASE IF NOT EXISTS aulatec
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aulatec;

CREATE TABLE IF NOT EXISTS cursos (
  id INT UNSIGNED NOT NULL PRIMARY KEY,
  nombre VARCHAR(150) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS matriculas (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  dni CHAR(8) NOT NULL,
  telefono CHAR(9) NOT NULL,
  curso_id INT UNSIGNED NOT NULL,
  turno ENUM('Mañana', 'Tarde', 'Noche') NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_matriculas_cursos
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_matriculas_creado_en (creado_en),
  INDEX idx_matriculas_dni (dni)
) ENGINE=InnoDB;

INSERT IGNORE INTO cursos (id, nombre) VALUES
  (1, 'Desarrollo Web con React'),
  (2, 'Diseño UX/UI'),
  (3, 'Análisis de Datos con Python'),
  (4, 'Marketing Digital'),
  (5, 'Gestión de Proyectos Ágiles'),
  (6, 'Ciberseguridad Esencial');
