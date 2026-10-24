<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

$error = '';
$mensaje = '';

if (isset($_GET['registrado'])) {
    $mensaje = 'Registro completado. Puedes acceder con tus credenciales.';
}
if (isset($_GET['pass_cambiada'])) {
    $mensaje = 'Contraseña actualizada correctamente. Inicia sesión.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = trim($_POST['usuario'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($usuario === '' || $password === '') {
        $error = 'Por favor, rellena todos los campos.';
    } else {
        $encontrado = false;
        foreach ($_SESSION['mimatriz'] as $user) {
            if ($user['Usuario'] === $usuario && $user['Contraseña'] === $password) {
                currentUser($usuario);
                $encontrado = true;
                redirect('../index.html');
                break;
            }
        }
        if (!$encontrado) {
            $error = 'El nombre de usuario o la contraseña son incorrectos.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Entrada al Colegio</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="warning-container">
    <h1>DAWlloween</h1>
    <h2>Entrada Principal</h2>

    <?php if ($error !== ''): ?>
      <div class="badge" style="background-color: var(--red-blood); margin-bottom: 1.5rem; display: block;">
        <?= htmlspecialchars($error) ?>
      </div>
    <?php endif; ?>

    <?php if ($mensaje !== ''): ?>
      <div class="badge" style="background-color: var(--amber-light); color: var(--purple-dark); margin-bottom: 1.5rem; display: block;">
        <?= htmlspecialchars($mensaje) ?>
      </div>
    <?php endif; ?>

    <form method="POST" action="login.php" style="display: flex; flex-direction: column; gap: 1rem; text-align: left;">
      <div>
        <label for="usuario" style="display: block; margin-bottom: 0.3rem;">Usuario:</label>
        <input type="text" id="usuario" name="usuario" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <div>
        <label for="password" style="display: block; margin-bottom: 0.3rem;">Contraseña:</label>
        <input type="password" id="password" name="password" required style="width: 100%; padding: 0.6rem; background: var(--purple-dark); border: 1px solid var(--amber-light); color: var(--parchment-txt); font-family: 'Special Elite', cursive;">
      </div>

      <button type="submit" style="margin-top: 1rem; padding: 0.8rem; background: var(--red-blood); color: var(--parchment-txt); border: 1px solid var(--amber-glow); font-family: 'Special Elite', cursive; cursor: pointer; text-transform: uppercase;">
        [ Entrar ]
      </button>
    </form>

    <div style="margin-top: 2rem; display: flex; justify-content: space-between; font-size: 0.95rem;">
      <a href="altaUsuario.php" style="color: var(--amber-glow); text-decoration: none;">[ Registrarse ]</a>
      <a href="cambioPass.php" style="color: var(--parchment-bg); text-decoration: none;">[ ¿Olvidaste la clave? ]</a>
    </div>
  </div>
</body>
</html>

