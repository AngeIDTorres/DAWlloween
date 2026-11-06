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

    if (isset($_POST['ajax']) || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false)) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => ($tipoEstado === 'exito'),
            'message' => $mensajeEstado,
            'status' => $tipoEstado
        ]);
        exit;
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
    <div class="office-flashlight flashlight-off" id="officeFlashlight"></div>

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
            <div class="typewriter-stamp-status <?= $tipoEstado === 'exito' ? 'stamp-success' : ($tipoEstado === 'error' ? 'stamp-error' : '') ?>" id="typewriterStampStatus" <?= $mensajeEstado === '' ? 'style="display: none;"' : '' ?>>
              <?= htmlspecialchars($mensajeEstado) ?>
            </div>

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
                <textarea id="cuerpo" name="cuerpo" rows="7" required class="typewriter-textarea" placeholder="Escribe tu mensaje a máquina..."><?= htmlspecialchars($cuerpo) ?></textarea>
              </div>
            </form>
          </div>
        </div>
      </div>

      <img src="../img/correo/rodillo_maquina_front.png" alt="" class="typewriter-roller-overlay" aria-hidden="true">
      <button type="submit" id="sendEmailBtn" form="typewriterMailForm" class="typewriter-send-btn typewriter-chassis-send-btn" title="Enviar correspondencia (Ctrl + Enter)">[ ENVIAR ]</button>
    </div>
  </main>

  <script type="module" src="../js/correo.js?v=20261106_01"></script>
</body>
</html>
