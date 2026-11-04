<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

if (!obtenerUsuarioActivo()) {
    redirect('login.php');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Sala de Juegos</title>
  <link rel="stylesheet" href="../css/globals.css">
  <link rel="stylesheet" href="../css/auth.css">
</head>
<body>
  <div class="warning-container">
    <h1>DAWlloween</h1>
    <h2>Sala de Juegos</h2>
    <div class="badge" style="background-color: var(--amber-glow); color: #1a1412; margin-bottom: 1.5rem; display: inline-block;">
      EN CONSTRUCCIÓN
    </div>
    <p style="color: var(--parchment-txt); margin: 1.5rem 0; line-height: 1.6;">
      El minijuego de supervivencia y escape está siendo desarrollado.
    </p>
    <div style="margin-top: 2rem; text-align: center;">
      <a href="../index.php" style="color: var(--amber-glow); text-decoration: none;">[ &larr; Volver al plano del colegio ]</a>
    </div>
  </div>
</body>
</html>

