<?php

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = leerJson();
    $nombre = trim((string) ($datos['nombre'] ?? ''));
    $email = trim((string) ($datos['email'] ?? ''));
    $dni = trim((string) ($datos['dni'] ?? ''));
    $telefono = trim((string) ($datos['telefono'] ?? ''));
    $cursoId = filter_var($datos['curso'] ?? null, FILTER_VALIDATE_INT);
    $turno = $datos['turno'] ?? '';

    if (strlen($nombre) < 3 || strlen($nombre) > 120) {
        responder(422, ['error' => 'El nombre debe tener entre 3 y 120 caracteres.']);
    }
    if (strlen($email) > 190 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        responder(422, ['error' => 'Escribe un correo electrónico válido.']);
    }
    if (!preg_match('/^\d{8}$/', $dni)) {
        responder(422, ['error' => 'El DNI debe tener 8 dígitos.']);
    }
    if (!preg_match('/^9\d{8}$/', $telefono)) {
        responder(422, ['error' => 'El celular debe tener 9 dígitos y empezar con 9.']);
    }
    if (!in_array($turno, ['Mañana', 'Tarde', 'Noche'], true)) {
        responder(422, ['error' => 'Selecciona un turno válido.']);
    }
    if (empty($datos['acepta']) || $cursoId === false) {
        responder(422, ['error' => 'Selecciona un curso y acepta los términos.']);
    }

    $conexion = obtenerConexion();
    $consulta = $conexion->prepare(
        'INSERT INTO matriculas (nombre, email, dni, telefono, curso_id, turno)
         SELECT :nombre, :email, :dni, :telefono, id, :turno
         FROM cursos WHERE id = :curso_id AND activo = 1',
    );
    $consulta->execute([
        'nombre' => $nombre,
        'email' => $email,
        'dni' => $dni,
        'telefono' => $telefono,
        'turno' => $turno,
        'curso_id' => $cursoId,
    ]);

    if ($consulta->rowCount() !== 1) {
        responder(422, ['error' => 'El curso seleccionado no existe o no está disponible.']);
    }

    responder(201, ['id' => (int) $conexion->lastInsertId()]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    header('Allow: GET, POST');
    responder(405, ['error' => 'Método no permitido.']);
}

$conexion = obtenerConexion();
$consulta = $conexion->query(
    'SELECT m.id, m.nombre, c.nombre AS curso,
            m.turno, DATE_FORMAT(m.creado_en, "%Y-%m-%d %H:%i:%s") AS creadoEn
     FROM matriculas m
     INNER JOIN cursos c ON c.id = m.curso_id
     ORDER BY m.creado_en DESC, m.id DESC',
);

responder(200, [
    'matriculas' => $consulta->fetchAll(),
]);
