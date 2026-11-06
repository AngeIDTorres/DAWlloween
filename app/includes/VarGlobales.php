<?php
if (session_status() === PHP_SESSION_NONE) {
    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

if (!isset($_SESSION['mimatriz'])) {
    $_SESSION['mimatriz'] = [
        [
            'Usuario' => 'halloween',
            'Contraseña' => '311026',
            'Email' => 'halloween@dawlloween.dev',
            'Perfil' => 'admin',
            'Pregunta' => '¿Cuál es tu peor pesadilla?',
            'Respuesta' => 'suspenso',
            'UsuarioActual' => false
        ]
    ];
} else {
    foreach ($_SESSION['mimatriz'] as &$u) {
        if ($u['Usuario'] === 'director') {
            $u['Usuario'] = 'halloween';
            $u['Email'] = 'halloween@dawlloween.dev';
        }
    }
}

if (!isset($_SESSION['usuario_activo'])) {
    $_SESSION['usuario_activo'] = null;
}

function generarCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validarCsrfToken($token) {
    if (!isset($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function redirect($url) {
    header('Location: ' . $url);
    exit();
}

function AltaUsuario($nuevoUser) {
    if (!isset($_SESSION['mimatriz']) || !is_array($_SESSION['mimatriz'])) {
        $_SESSION['mimatriz'] = [];
    }
    foreach ($_SESSION['mimatriz'] as $user) {
        if (strcasecmp($user['Usuario'], $nuevoUser['Usuario']) === 0) {
            return false;
        }
    }
    $nuevoUser['UsuarioActual'] = false;
    $_SESSION['mimatriz'][] = $nuevoUser;
    return true;
}

function cambioContraseña($usuario, $respuesta, $nuevaPassword) {
    if (!isset($_SESSION['mimatriz']) || !is_array($_SESSION['mimatriz'])) {
        return false;
    }
    foreach ($_SESSION['mimatriz'] as &$user) {
        if (strcasecmp($user['Usuario'], $usuario) === 0) {
            if (strcasecmp(trim($user['Respuesta']), trim($respuesta)) === 0) {
                $user['Contraseña'] = $nuevaPassword;
                return true;
            }
            return false;
        }
    }
    return false;
}

function obtenerPreguntaUsuario($usuario) {
    if (!isset($_SESSION['mimatriz']) || !is_array($_SESSION['mimatriz'])) {
        return null;
    }
    foreach ($_SESSION['mimatriz'] as $user) {
        if (strcasecmp($user['Usuario'], $usuario) === 0) {
            return $user['Pregunta'];
        }
    }
    return null;
}

function currentUser($usuario) {
    if (!isset($_SESSION['mimatriz']) || !is_array($_SESSION['mimatriz'])) {
        return null;
    }
    foreach ($_SESSION['mimatriz'] as &$user) {
        if (strcasecmp($user['Usuario'], $usuario) === 0) {
            $user['UsuarioActual'] = true;
            $_SESSION['usuario_activo'] = $user;
            session_regenerate_id(true);
            return $user;
        } else {
            $user['UsuarioActual'] = false;
        }
    }
    return null;
}

function obtenerUsuarioActivo() {
    return $_SESSION['usuario_activo'] ?? null;
}

function cerrarSesion() {
    if (isset($_SESSION['mimatriz'])) {
        foreach ($_SESSION['mimatriz'] as &$user) {
            $user['UsuarioActual'] = false;
        }
    }
    $_SESSION['usuario_activo'] = null;
    session_regenerate_id(true);
}

function requerirAutenticacion($loginUrl = 'login.php') {
    if (!obtenerUsuarioActivo()) {
        redirect($loginUrl);
    }
}

function enviarRespuestaJson(array $data, int $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data);
    exit();
}
