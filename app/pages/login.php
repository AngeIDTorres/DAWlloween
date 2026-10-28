<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

$error = '';
$mensaje = '';
$hasError = false;
$loginSuccess = false;

if (isset($_GET['registrado'])) {
    $mensaje = 'Registro completado. Introduce tus credenciales.';
}
if (isset($_GET['pass_cambiada'])) {
    $mensaje = 'Contraseña actualizada. Inicia sesión.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($usuario === '' || $password === '') {
        $error = 'Rellena todos los campos.';
        $hasError = true;
    } else {
        $encontrado = false;
        foreach ($_SESSION['mimatriz'] as $user) {
            if ($user['Usuario'] === $usuario && $user['Contraseña'] === $password) {
                currentUser($usuario);
                $encontrado = true;
                $loginSuccess = true;
                break;
            }
        }
        if (!$encontrado) {
            $error = 'Combinación errónea. Clave rechazada.';
            $hasError = true;
        }
    }

    if (isset($_POST['ajax']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')) {
        header('Content-Type: application/json');
        echo json_encode(['success' => $loginSuccess, 'error' => $error]);
        exit;
    }
}
$startExpanded = $hasError || $loginSuccess || isset($_GET['registrado']) || isset($_GET['pass_cambiada']);
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Entrada al Colegio</title>
  <link rel="preload" href="../audio/login/ambiente_noche.ogg" as="fetch" crossorigin>
  <link rel="preload" href="../audio/login/candado_salto.mp3" as="fetch" crossorigin>
  <link rel="preload" href="../audio/login/candado_expandir.mp3" as="fetch" crossorigin>
  <link rel="stylesheet" href="../css/globals.css">
  <link rel="stylesheet" href="../css/login.css">
  <?php if ($loginSuccess): ?>
    <noscript>
      <meta http-equiv="refresh" content="2;url=../index.html">
    </noscript>
  <?php endif; ?>
</head>
<body data-login-success="<?= $loginSuccess ? 'true' : 'false' ?>">
  <div class="login-stage <?= $startExpanded ? 'form-active' : '' ?>">
    <div class="moon-light-system">
      <div class="moon-glow"></div>
      <div class="moon-rays"></div>
      <div class="moon-rays secondary"></div>
    </div>
    <div class="darkness-veil" id="darknessVeil"></div>
    <div class="flashlight-beam" id="flashlightBeam"></div>

    <div class="gate-container">
      <div class="gate-leaf left" id="gateLeft"></div>
      <div class="gate-leaf right" id="gateRight"></div>
    </div>

    <div class="padlock-wrapper <?= $startExpanded ? 'expanded' : 'hopping' ?>" id="padlockWrapper" data-error="<?= $hasError ? 'true' : 'false' ?>">
      <div class="padlock-hop-inner">
        <div class="shackle-graphic" id="shackleGraphic"></div>

        <div class="padlock-graphic">
          <form method="POST" action="login.php" id="loginForm">
            <div class="plate-content">
            <?php if ($error !== ''): ?>
              <div class="plate-alert">
                <?= htmlspecialchars($error) ?>
              </div>
            <?php endif; ?>

            <?php if ($mensaje !== ''): ?>
              <div class="plate-success">
                <?= htmlspecialchars($mensaje) ?>
              </div>
            <?php endif; ?>

            <div class="plate-field">
              <label for="usuario">USUARIO:</label>
              <input type="text" id="usuario" name="usuario" autocomplete="off" required>
            </div>

            <div class="plate-field">
              <label for="password">CLAVE:</label>
              <input type="password" id="password" name="password" required>
            </div>

            <div class="plate-links">
              <a href="altaUsuario.php">[ REGISTRO ]</a>
              <span class="sep">•</span>
              <a href="cambioPass.php">[ ¿CLAVE PERDIDA? ]</a>
            </div>
          </div>

          <button type="submit" class="keyhole-btn" id="keyholeBtn" title="Gira la llave para entrar">
            <div class="antique-key <?= $loginSuccess ? 'turning turned' : '' ?>" id="antiqueKey">
              <?php if (file_exists(__DIR__ . '/../img/login/llave_antigua.png')): ?>
                <img src="../img/login/llave_antigua.png" alt="Llave" class="key-img">
              <?php else: ?>
                <svg viewBox="0 0 36 72" class="key-svg" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="14" r="11" fill="none" stroke="#DDA95A" stroke-width="2.5"/>
                  <circle cx="18" cy="14" r="5" fill="none" stroke="#8A2E2E" stroke-width="1.8"/>
                  <circle cx="18" cy="5" r="2.5" fill="#C68E42"/>
                  <path d="M18 25 L18 64" stroke="#DDA95A" stroke-width="3.5" stroke-linecap="round"/>
                  <path d="M18 48 L25 48" stroke="#DDA95A" stroke-width="2.5" stroke-linecap="square"/>
                  <path d="M18 56 L27 56" stroke="#DDA95A" stroke-width="2.5" stroke-linecap="square"/>
                  <path d="M22 60 L27 60" stroke="#DDA95A" stroke-width="2.5" stroke-linecap="square"/>
                </svg>
              <?php endif; ?>
            </div>
          </button>
        </form>
      </div>
    </div>
  </div>
</div>

  <div class="blackout-curtain" id="blackoutCurtain"></div>

  <script type="module" src="../js/main.js"></script>
</body>
</html>
