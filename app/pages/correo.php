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
    <title>Prueba de Envío de Correo - DAWlloween</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; line-height: 1.5;">

    <h2>Prueba Básica de Envío SMTP (Gmail)</h2>
    <p><a href="../index.php">&larr; Volver al mapa</a></p>

    <div style="background: #f4f4f4; padding: 12px; border: 1px solid #ccc; margin-bottom: 20px; font-size: 14px;">
        <strong>Estado de sendmail.ini:</strong>
        <?php if ($iniExists): ?>
            <span style="color: green;">Montado y detectado (<?= htmlspecialchars($iniPath) ?>)</span><br>
            <strong>Servidor:</strong> <?= htmlspecialchars($iniData['smtp_server'] ?? 'No definido') ?>:<?= htmlspecialchars($iniData['smtp_port'] ?? '') ?><br>
            <strong>Usuario configurado:</strong> <?= htmlspecialchars($iniData['auth_username'] ?? 'No definido') ?><br>
            <strong>Contraseña configurada:</strong> <?= !empty($iniData['auth_password']) ? '******** (' . strlen($iniData['auth_password']) . ' caracteres)' : '<span style="color: red;">No configurada</span>' ?>
        <?php else: ?>
            <span style="color: red;">No se encontró el archivo sendmail.ini</span>
        <?php endif; ?>
    </div>

    <?php if ($mensajeEstado !== ''): ?>
        <div style="padding: 12px; margin-bottom: 20px; border-radius: 4px; <?= $tipoEstado === 'exito' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' ?>">
            <?= htmlspecialchars($mensajeEstado) ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="correo.php" style="display: flex; flex-direction: column; gap: 12px;">
        <div>
            <label for="destinatario" style="display: block; font-weight: bold; margin-bottom: 4px;">Destinatario:</label>
            <input type="email" id="destinatario" name="destinatario" placeholder="tu_correo_personal@gmail.com" required style="width: 100%; padding: 8px; box-sizing: border-box;">
        </div>

        <div>
            <label for="asunto" style="display: block; font-weight: bold; margin-bottom: 4px;">Asunto:</label>
            <input type="text" id="asunto" name="asunto" value="Prueba de correo - DAWlloween" required style="width: 100%; padding: 8px; box-sizing: border-box;">
        </div>

        <div>
            <label for="cuerpo" style="display: block; font-weight: bold; margin-bottom: 4px;">Mensaje:</label>
            <textarea id="cuerpo" name="cuerpo" rows="5" required style="width: 100%; padding: 8px; box-sizing: border-box;">Hola, este es un mensaje de prueba enviado desde DAWlloween usando SMTP de Gmail.</textarea>
        </div>

        <div>
            <button type="submit" style="padding: 10px 20px; font-size: 16px; cursor: pointer; background: #0066cc; color: #fff; border: none; border-radius: 4px;">
                Enviar Correo
            </button>
        </div>
    </form>

    <?php if ($debugLog !== ''): ?>
        <h3 style="margin-top: 30px;">Últimos registros de envío (/tmp/sendmail.log):</h3>
        <pre style="background: #222; color: #eee; padding: 12px; overflow-x: auto; font-size: 13px; max-height: 250px;"><?= htmlspecialchars($debugLog) ?></pre>
    <?php endif; ?>

</body>
</html>

