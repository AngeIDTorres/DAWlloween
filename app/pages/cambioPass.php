<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

$error = '';
$usuario = trim($_POST['usuario'] ?? $_GET['usuario'] ?? '');
$pregunta = null;
$paso = 1;

if ($usuario !== '') {
  $pregunta = obtenerPreguntaUsuario($usuario);
  if ($pregunta !== null) {
    $paso = 2;
  } else {
    $error = 'El usuario no existe en los registros del colegio.';
    $paso = 1;
  }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['actualizar'])) {
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

<body>
  <div class="warning-container">
    <h1>DAWlloween</h1>
    <h2>Recuperación de Clave</h2>

    <?php if ($error !== ''): ?>
      <div class="badge" style="background-color: var(--red-blood); margin-bottom: 1.5rem; display: block;">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <?php if ($paso === 1): ?>
      <form method="POST" action="cambioPass.php" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
        <div>
          <label for="usuario" style="display: block; margin-bottom: 0.3rem;">Introduce tu Nombre de Usuario:</label>
          <input type="text" id="usuario" name="usuario" value="<?= htmlspecialchars($usuario) ?>" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
        </div>

        <button type="submit" style="margin-top: 1rem; padding: 0.8rem; background: var(--red-blood); color: var(--parchment-txt); border: 1px solid var(--amber-glow); font-family: 'Special Elite', cursive; cursor: pointer; text-transform: uppercase;">
          [ Consultar Pregunta Secreta ]
        </button>
      </form>
    <?php else: ?>
      <form method="POST" action="cambioPass.php" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
        <input type="hidden" name="usuario" value="<?= htmlspecialchars($usuario) ?>">
        <input type="hidden" name="actualizar" value="1">

        <div style="background: rgba(35, 23, 51, 0.8); border: 1px solid var(--amber-glow); padding: 1rem; margin-bottom: 0.5rem;">
          <span style="color: var(--parchment-txt); font-size: 0.95rem; display: block; margin-bottom: 0.3rem;">Usuario: <strong><?= htmlspecialchars($usuario) ?></strong></span>
          <span style="color: var(--amber-glow); font-size: 1.1rem; display: block;">Pregunta: <?= htmlspecialchars($pregunta) ?></span>
        </div>

        <div>
          <label for="respuesta" style="display: block; margin-bottom: 0.3rem;">Tu Respuesta Secreta:</label>
          <input type="text" id="respuesta" name="respuesta" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
        </div>

        <div>
          <label for="nueva_password" style="display: block; margin-bottom: 0.3rem;">Nueva Contraseña:</label>
          <input type="password" id="nueva_password" name="nueva_password" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
        </div>

        <button type="submit" style="margin-top: 1rem; padding: 0.8rem; background: var(--red-blood); color: var(--parchment-txt); border: 1px solid var(--amber-glow); font-family: 'Special Elite', cursive; cursor: pointer; text-transform: uppercase;">
          [ Actualizar Contraseña ]
        </button>
      </form>

      <div style="margin-top: 1rem; text-align: center;">
        <a href="cambioPass.php" style="color: var(--amber-glow); text-decoration: none; font-size: 0.9rem;">[ Consultar con otro usuario ]</a>
      </div>
    <?php endif; ?>

    <div style="margin-top: 2rem; text-align: center;">
      <a href="login.php" style="color: var(--parchment-bg); text-decoration: none;">[ Volver a la Entrada ]</a>
    </div>
  </div>
</body>

</html>