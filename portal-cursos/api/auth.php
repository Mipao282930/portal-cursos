<?php

require __DIR__ . '/bootstrap.php';

iniciarSesion();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    responder(200, [
        'autenticado' => !empty($_SESSION['admin']),
        'usuario' => $_SESSION['admin'] ?? null,
    ]);
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $parametros = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $parametros['path'], $parametros['domain'], $parametros['secure'], $parametros['httponly']);
    }
    session_destroy();
    responder(200, ['mensaje' => 'Sesión cerrada.']);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: GET, POST, DELETE');
    responder(405, ['error' => 'Método no permitido.']);
}

$configuracion = obtenerConfiguracion()['admin'];
$datos = leerJson();
$usuario = trim((string) ($datos['usuario'] ?? ''));
$clave = (string) ($datos['clave'] ?? '');

if (
    !hash_equals($configuracion['username'], $usuario)
    || !password_verify($clave, $configuracion['password_hash'])
) {
    responder(401, ['error' => 'Usuario o contraseña incorrectos.']);
}

session_regenerate_id(true);
$_SESSION['admin'] = $configuracion['username'];
responder(200, ['usuario' => $_SESSION['admin']]);
