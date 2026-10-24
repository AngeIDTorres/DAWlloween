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
  <title>DAWlloween - Ficha de Nuevo Alumno</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="warning-container">
    <h1>DAWlloween</h1>
    <h2>Ficha de Ingreso</h2>

    <?php if ($error !== ''): ?>
      <div class="badge" style="background-color: var(--red-blood); margin-bottom: 1.5rem; display: block;">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="altaUsuario.php" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
      <input type="hidden" name="perfil" value="user">

      <div>
        <label for="usuario" style="display: block; margin-bottom: 0.3rem;">Nombre de Usuario:</label>
        <input type="text" id="usuario" name="usuario" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <div>
        <label for="password" style="display: block; margin-bottom: 0.3rem;">Contraseña:</label>
        <input type="password" id="password" name="password" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <div>
        <label for="email" style="display: block; margin-bottom: 0.3rem;">Correo Electrónico:</label>
        <input type="email" id="email" name="email" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <div>
        <label for="pregunta" style="display: block; margin-bottom: 0.3rem;">Pregunta de Seguridad Secreta:</label>
        <input type="text" id="pregunta" name="pregunta" placeholder="Ej: ¿Cuál es tu mayor miedo?" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <div>
        <label for="respuesta" style="display: block; margin-bottom: 0.3rem;">Respuesta Secreta:</label>
        <input type="text" id="respuesta" name="respuesta" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <button type="submit" style="margin-top: 1rem; padding: 0.8rem; background: var(--red-blood); color: var(--parchment-txt); border: 1px solid var(--amber-glow); font-family: 'Special Elite', cursive; cursor: pointer; text-transform: uppercase;">
        [ Registrar Usuario ]
      </button>
    </form>

    <div style="margin-top: 2rem; text-align: center;">
      <a href="login.php" style="color: var(--amber-glow); text-decoration: none;">[ Volver a la Entrada ]</a>
    </div>
  </div>
</body>
</html>

