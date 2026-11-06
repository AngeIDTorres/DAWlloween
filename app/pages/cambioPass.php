<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

$error = '';
$usuario = trim($_POST['usuario'] ?? $_GET['usuario'] ?? '');
$pregunta = null;
$paso = 1;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!validarCsrfToken($csrfToken)) {
        $error = 'Petición inválida o sesión expirada. Recarga la página.';
    } else {
        if ($usuario !== '' && !isset($_POST['actualizar'])) {
            $pregunta = obtenerPreguntaUsuario($usuario);
            if ($pregunta !== null) {
                $paso = 2;
            } else {
                $error = 'El usuario no existe en los registros del colegio.';
                $paso = 1;
            }
        } elseif (isset($_POST['actualizar'])) {
            $pregunta = obtenerPreguntaUsuario($usuario);
            $paso = 2;
            $respuesta = trim($_POST['respuesta'] ?? '');
            $nuevaPassword = trim($_POST['nueva_password'] ?? '');

            if ($respuesta === '' || $nuevaPassword === '') {
                $error = 'Debes responder a la pregunta secreta e introducir la nueva clave.';
            } else {
                if (cambioContraseña($usuario, $respuesta, $nuevaPassword)) {
                    redirect('login.php?pass_cambiada=1');
                } else {
                    $error = 'La respuesta secreta no es correcta. Inténtalo de nuevo.';
                }
            }
        }
    }
} elseif ($usuario !== '') {
    $pregunta = obtenerPreguntaUsuario($usuario);
    if ($pregunta !== null) {
        $paso = 2;
    } else {
        $error = 'El usuario no existe en los registros del colegio.';
        $paso = 1;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Recuperación de Acceso</title>
  <link rel="stylesheet" href="../css/globals.css">
  <link rel="stylesheet" href="../css/auth.css">
</head>
<body class="auth-body">

  <main class="folio-a4-sheet <?= file_exists(__DIR__ . '/../img/auth/folio_expediente_a4.png') ? 'has-folio-img' : '' ?>">
    <?php if (file_exists(__DIR__ . '/../img/auth/folio_expediente_a4.png')): ?>
      <img src="../img/auth/folio_expediente_a4.png" alt="Folio A4 Expediente" class="folio-background-img">
    <?php endif; ?>

    <div class="folio-content">
      <header class="folio-header">
        <div class="folio-meta-bar">
          <span>DIRECCIÓN Y SEGURIDAD · PROTOCOLO</span>
        </div>
        <h1 class="folio-title">Recuperación de Clave</h1>
        <p class="folio-subtitle">Restablecimiento de Credenciales de Acceso</p>

        <div class="folio-step-indicator">
          <span class="folio-step-pill <?= $paso === 1 ? 'active' : '' ?>">1. Identificación</span>
          <span class="folio-step-pill <?= $paso === 2 ? 'active' : '' ?>">2. Verificación Secreta</span>
        </div>
      </header>

      <?php if ($error !== ''): ?>
        <div class="folio-alert-error" role="alert">
          <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>

      <?php if ($paso === 1): ?>
        <form method="POST" action="cambioPass.php" class="folio-form">
          <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(generarCsrfToken()) ?>">
          <div class="folio-field">
            <label for="usuario" class="folio-label">
              Nombre de Usuario Registrado <span class="required-mark">*</span>
            </label>
            <input type="text" id="usuario" name="usuario" value="<?= htmlspecialchars($usuario) ?>" class="folio-input" autocomplete="off" required placeholder="Introduce tu usuario del colegio">
            <span class="folio-field-hint">Se consultará el libro de registro para obtener tu pregunta secreta.</span>
          </div>

          <button type="submit" class="folio-btn">
            [ Consultar ]
          </button>
        </form>
      <?php else: ?>
        <form method="POST" action="cambioPass.php" class="folio-form">
          <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(generarCsrfToken()) ?>">
          <input type="hidden" name="usuario" value="<?= htmlspecialchars($usuario) ?>">
          <input type="hidden" name="actualizar" value="1">

          <div class="folio-info-box">
            <div class="folio-info-row">
              <span class="folio-info-label">Expediente de Alumno</span>
              <span class="folio-info-value"><?= htmlspecialchars($usuario) ?></span>
            </div>
            <div class="folio-info-row" style="margin-top: 0.6rem;">
              <span class="folio-info-label">Pregunta de Seguridad Archivada</span>
              <div class="folio-info-question">&laquo; <?= htmlspecialchars($pregunta) ?> &raquo;</div>
            </div>
          </div>

          <div class="folio-field">
            <label for="respuesta" class="folio-label">
              Tu Respuesta Secreta <span class="required-mark">*</span>
            </label>
            <input type="text" id="respuesta" name="respuesta" class="folio-input" autocomplete="off" required placeholder="Respuesta que diste al registrarte">
          </div>

          <div class="folio-field">
            <label for="nueva_password" class="folio-label">
              Nueva Contraseña de Seguridad <span class="required-mark">*</span>
            </label>
            <input type="password" id="nueva_password" name="nueva_password" class="folio-input" required placeholder="Nueva clave de acceso">
            <span class="folio-field-hint">Asegúrate de memorizar la nueva clave antes de sellar el cambio.</span>
          </div>

          <button type="submit" class="folio-btn">
            [ Actualizar Contraseña ]
          </button>

          <div style="text-align: center; margin-top: 0.5rem;">
            <a href="cambioPass.php" class="folio-link secondary">[ Consultar con otro usuario ]</a>
          </div>
        </form>
      <?php endif; ?>

      <footer class="folio-footer">
        <a href="login.php" class="folio-link">[ &larr; Volver a la Entrada del Colegio ]</a>
      </footer>
    </div>
  </main>

</body>
</html>
