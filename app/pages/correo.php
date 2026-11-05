<?php
require_once __DIR__ . '/../includes/VarGlobales.php';

if (!obtenerUsuarioActivo()) {
    redirect('login.php');
}

$mensajeEstado = '';
$tipoEstado = '';
$debugLog = '';

$iniPath = file_exists('/etc/sendmail.ini') ? '/etc/sendmail.ini' : __DIR__ . '/../../config/sendmail.ini';
$iniExists = file_exists($iniPath);
$iniData = $iniExists ? @parse_ini_file($iniPath) : [];

$destinatario = '';
$asunto = '';
$cuerpo = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destinatario = trim($_POST['destinatario'] ?? '');
    $asunto = trim($_POST['asunto'] ?? '');
    $cuerpo = trim($_POST['cuerpo'] ?? '');

    if ($destinatario === '' || $asunto === '' || $cuerpo === '') {
        $mensajeEstado = 'Por favor, completa todos los campos del formulario.';
        $tipoEstado = 'error';
    } elseif (!filter_var($destinatario, FILTER_VALIDATE_EMAIL)) {
        $mensajeEstado = 'El correo del destinatario no tiene un formato válido.';
        $tipoEstado = 'error';
    } else {
        $remitente = !empty($iniData['force_sender']) ? $iniData['force_sender'] : (!empty($iniData['auth_username']) ? $iniData['auth_username'] : 'no-reply@halloween.dev');
        
        $cabeceras = [];
        $cabeceras[] = "From: DAWlloween <$remitente>";
        $cabeceras[] = "Reply-To: $remitente";
        $cabeceras[] = "X-Mailer: PHP/" . phpversion();
        $cabeceras[] = "MIME-Version: 1.0";
        $cabeceras[] = "Content-Type: text/plain; charset=UTF-8";

        $enviado = @mail($destinatario, $asunto, $cuerpo, implode("\r\n", $cabeceras));

        if ($enviado) {
            $mensajeEstado = "¡Correo enviado con éxito a $destinatario!";
            $tipoEstado = 'exito';
        } else {
            $mensajeEstado = "Error al enviar el correo. Revisa la configuración de Gmail o los logs.";
            $tipoEstado = 'error';
        }

        if (file_exists('/tmp/sendmail.log')) {
            $debugLog = file_get_contents('/tmp/sendmail.log');
        }
    }
} elseif (file_exists('/tmp/sendmail.log')) {
    $debugLog = file_get_contents('/tmp/sendmail.log');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DAWlloween - Despacho de Dirección y Correo</title>
  <link rel="stylesheet" href="../css/globals.css">
  <link rel="stylesheet" href="../css/correo.css">
  <link rel="stylesheet" href="../css/accessibility.css">
</head>
<body class="office-page">
  <div class="blackout-curtain active" id="blackoutCurtain"></div>

  <main class="office-stage room-lit" id="officeStage">
    <div class="office-darkness-veil" id="officeDarknessVeil"></div>
    <div class="office-flashlight" id="officeFlashlight"></div>

    <div class="office-interactive-area" id="officeInteractiveArea">
      <div class="office-desk-lamp" id="officeDeskLamp" title="Encender / Apagar lámpara de sobremesa (Tecla L)">
        <div class="lamp-glow-aura"></div>
        <div class="lamp-light-cone"></div>
        <div class="lamp-graphic lamp-off"></div>
        <div class="lamp-graphic lamp-on"></div>
      </div>

      <div class="typewriter-paper-feeder" id="typewriterPaperFeeder">
        <div class="typewriter-paper-sheet" id="typewriterPaperSheet">
          <img src="../img/correo/folio_maquina_escribir.png" alt="Folio mecanografiado" class="typewriter-paper-bg">

          <div class="typewriter-form-content">
            <?php if ($mensajeEstado !== ''): ?>
              <div class="typewriter-stamp-status <?= $tipoEstado === 'exito' ? 'stamp-success' : 'stamp-error' ?>">
                <?= htmlspecialchars($mensajeEstado) ?>
              </div>
            <?php endif; ?>

            <form method="POST" action="correo.php" id="typewriterMailForm" class="typewriter-form">
              <div class="typewriter-field">
                <label for="destinatario" class="typewriter-label">PARA:</label>
                <input type="email" id="destinatario" name="destinatario" value="<?= htmlspecialchars($destinatario) ?>" placeholder="destinatario@correo.com" required class="typewriter-input" autocomplete="off">
              </div>

              <div class="typewriter-field">
                <label for="asunto" class="typewriter-label">ASUNTO:</label>
                <input type="text" id="asunto" name="asunto" value="<?= htmlspecialchars($asunto) ?>" placeholder="Expediente de Dirección..." required class="typewriter-input" autocomplete="off">
              </div>

              <div class="typewriter-field typewriter-field-body">
                <label for="cuerpo" class="typewriter-label">PEORES PESADILLAS:</label>
                <textarea id="cuerpo" name="cuerpo" rows="5" required class="typewriter-textarea" placeholder="Escribe tu mensaje a máquina..."><?= htmlspecialchars($cuerpo) ?></textarea>
              </div>

              <div class="typewriter-action-row">
                <button type="submit" id="sendEmailBtn" class="typewriter-send-btn">[ ENVIAR ]</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </main>

  <script type="module" src="../js/correo.js"></script>
</body>
</html>
