<?php

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function responder(int $estado, array $datos): never
{
    http_response_code($estado);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function obtenerConfiguracion(): array
{
    $archivo = __DIR__ . '/config.local.php';
    if (!is_file($archivo)) {
        error_log('Falta api/config.local.php. Copia api/config.example.php y configura el acceso.');
        responder(500, ['error' => 'Falta configurar la API. Revisa las instrucciones del proyecto.']);
    }

    $configuracion = require $archivo;
    if (
        !is_array($configuracion)
        || empty($configuracion['database']['name'])
        || empty($configuracion['admin']['username'])
        || empty($configuracion['admin']['password_hash'])
    ) {
        responder(500, ['error' => 'La configuración de base de datos o administrador está incompleta.']);
    }

    return $configuracion;
}

function obtenerConexion(): PDO
{
    $configuracion = obtenerConfiguracion()['database'];
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $configuracion['host'],
        $configuracion['name'],
    );

    try {
        return new PDO($dsn, $configuracion['user'], $configuracion['password'], [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    } catch (PDOException $error) {
        error_log('No se pudo conectar a MySQL: ' . $error->getMessage());
        responder(500, ['error' => 'No se pudo conectar a la base de datos. Revisa la configuración de Laragon.']);
    }
}

function iniciarSesion(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Strict',
        'path' => '/',
    ]);
    session_start();
}

function exigirAdministrador(): void
{
    iniciarSesion();
    if (empty($_SESSION['admin'])) {
        responder(401, ['error' => 'Inicia sesión para ver las matrículas.']);
    }
}

function leerJson(): array
{
    $datos = json_decode(file_get_contents('php://input'), true);
    if (!is_array($datos)) {
        responder(400, ['error' => 'El cuerpo de la solicitud no es válido.']);
    }

    return $datos;
}
