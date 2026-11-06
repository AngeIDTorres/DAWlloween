<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $password = trim($_POST['password'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $perfil = trim($_POST['perfil'] ?? 'user');
    $pregunta = trim($_POST['pregunta'] ?? '');
    $respuesta = trim($_POST['respuesta'] ?? '');

    if ($usuario === '' || $password === '' || $email === '' || $pregunta === '' || $respuesta === '') {
        $error = 'Todos los campos son obligatorios.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'El formato del correo electrónico no es válido.';
    } else {
        $nuevoUser = [
            'Usuario' => $usuario,
            'Contraseña' => $password,
            'Email' => $email,
            'Perfil' => $perfil !== '' ? $perfil : 'user',
            'Pregunta' => $pregunta,
            'Respuesta' => $respuesta,
            'UsuarioActual' => false
        ];

        if (AltaUsuario($nuevoUser)) {
            redirect('login.php?registrado=1');
        } else {
            $error = 'El nombre de usuario ya está registrado en el colegio.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Ficha de Ingreso de Alumno</title>
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
          <span>ARCHIVO ESCOLAR</span>
        </div>
        <h1 class="folio-title">Ficha de Ingreso</h1>
        <p class="folio-subtitle">Registro de Nuevo Alumno</p>
      </header>

      <?php if ($error !== ''): ?>
        <div class="folio-alert-error" role="alert">
          <?= htmlspecialchars($error) ?>
        </div>
      <?php endif; ?>

      <form method="POST" action="altaUsuario.php" class="folio-form">
        <input type="hidden" name="perfil" value="user">

        <div class="folio-field">
          <label for="usuario" class="folio-label">
            Nombre de Usuario <span class="required-mark">*</span>
          </label>
          <input type="text" id="usuario" name="usuario" class="folio-input" autocomplete="off" required placeholder="Identificador del alumno">
        </div>

        <div class="folio-field">
          <label for="password" class="folio-label">
            Contraseña de Seguridad <span class="required-mark">*</span>
          </label>
          <input type="password" id="password" name="password" class="folio-input" required placeholder="Clave confidencial">
        </div>

        <div class="folio-field">
          <label for="email" class="folio-label">
            Correo Electrónico <span class="required-mark">*</span>
          </label>
          <input type="email" id="email" name="email" class="folio-input" required placeholder="alumno@dawlloween.dev">
          <span class="folio-field-hint">Se utilizará para verificar tu expediente y recibir comunicados.</span>
        </div>

        <div class="folio-field">
          <label for="pregunta" class="folio-label">
            Pregunta Secreta de Identificación <span class="required-mark">*</span>
          </label>
          <input type="text" id="pregunta" name="pregunta" class="folio-input" required placeholder="Ej: ¿Cuál fue tu peor pesadilla en el colegio?">
          <span class="folio-field-hint">Pregunta clave que te permitirá restablecer tu acceso en caso de pérdida.</span>
        </div>

        <div class="folio-field">
          <label for="respuesta" class="folio-label">
            Respuesta Secreta <span class="required-mark">*</span>
          </label>
          <input type="text" id="respuesta" name="respuesta" class="folio-input" required placeholder="Respuesta confidencial exacta">
        </div>

        <button type="submit" class="folio-btn">
          [ Registrarse ]
        </button>
      </form>

      <footer class="folio-footer">
        <a href="login.php" class="folio-link">[ &larr; Volver a la Entrada del Colegio ]</a>
      </footer>
    </div>
  </main>

</body>
</html>
