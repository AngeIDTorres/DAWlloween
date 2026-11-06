#!/usr/bin/env php
<?php
$logFile = '/tmp/sendmail.log';
function logMsg($msg) {
    global $logFile;
    @file_put_contents($logFile, date('[Y-m-d H:i:s] ') . $msg . "\n", FILE_APPEND);
}

$rawEmail = file_get_contents('php://stdin');
if ($rawEmail === false || strlen($rawEmail) === 0) {
    logMsg("ERROR: Entrada de correo vacia desde STDIN.");
    exit(1);
}

$iniPaths = [
    '/etc/sendmail.ini',
    '/config/sendmail.ini',
    __DIR__ . '/sendmail.ini',
    dirname(__DIR__) . '/config/sendmail.ini'
];
$iniFile = null;
foreach ($iniPaths as $path) {
    if (file_exists($path)) {
        $iniFile = $path;
        break;
    }
}

if (!$iniFile) {
    logMsg("ERROR: Archivo sendmail.ini no encontrado en el sistema.");
    exit(1);
}

$ini = @parse_ini_file($iniFile);
if (!$ini) {
    logMsg("ERROR: No se pudo parsear el archivo $iniFile.");
    exit(1);
}

$server = trim($ini['smtp_server'] ?? 'smtp.gmail.com');
$port = (int)($ini['smtp_port'] ?? 587);
$sslMode = strtolower(trim($ini['smtp_ssl'] ?? 'tls'));
$username = trim($ini['auth_username'] ?? '');
$password = str_replace(' ', '', trim($ini['auth_password'] ?? ''));
$forceSender = trim($ini['force_sender'] ?? $username);

$recipients = [];
foreach (array_slice($argv, 1) as $arg) {
    if ($arg !== '' && $arg[0] !== '-' && filter_var($arg, FILTER_VALIDATE_EMAIL)) {
        $recipients[] = $arg;
    }
}

$parts = preg_split("/\r?\n\r?\n/", $rawEmail, 2);
$headerText = $parts[0] ?? '';
$body = $parts[1] ?? '';

if (empty($recipients)) {
    if (preg_match_all('/^(?:To|Cc|Bcc):\s*(.+)$/mi', $headerText, $matches)) {
        foreach ($matches[1] as $recipientLine) {
            $addresses = explode(',', $recipientLine);
            foreach ($addresses as $addr) {
                if (preg_match('/<([^>]+)>/', $addr, $m)) {
                    $candidate = trim($m[1]);
                } else {
                    $candidate = trim($addr);
                }
                if (filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
                    $recipients[] = $candidate;
                }
            }
        }
    }
}

$recipients = array_values(array_unique(array_filter($recipients)));
if (empty($recipients)) {
    logMsg("ERROR: No se encontraron destinatarios validos.");
    exit(1);
}

$from = $forceSender;
if (empty($from) && preg_match('/^From:\s*(.+)$/mi', $headerText, $m)) {
    if (preg_match('/<([^>]+)>/', $m[1], $em)) {
        $from = trim($em[1]);
    } else {
        $from = trim($m[1]);
    }
}
if (empty($from)) {
    $from = $username ?: 'no-reply@halloween.dev';
}

$timeout = 20;
$protocol = ($sslMode === 'ssl' || $port === 465) ? 'ssl://' : 'tcp://';
$context = stream_context_create([
    'ssl' => [
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    ]
]);

$socket = @stream_socket_client($protocol . $server . ':' . $port, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
if (!$socket) {
    logMsg("ERROR de conexion a {$protocol}{$server}:{$port} -> ($errno) $errstr");
    exit(1);
}

function readSmtp($socket) {
    $res = '';
    while (!feof($socket) && ($line = fgets($socket, 512))) {
        $res .= $line;
        if (isset($line[3]) && $line[3] === ' ') {
            break;
        }
    }
    return $res;
}

function sendSmtp($socket, $cmd, $expectedCode) {
    fwrite($socket, $cmd . "\r\n");
    $res = readSmtp($socket);
    $code = substr($res, 0, 3);
    if ($code !== (string)$expectedCode) {
        logMsg("FALLO SMTP [$cmd]: " . trim($res));
        return false;
    }
    return true;
}

$greeting = readSmtp($socket);
if (substr($greeting, 0, 3) !== '220') {
    logMsg("ERROR en saludo inicial: " . trim($greeting));
    fclose($socket);
    exit(1);
}

if (!sendSmtp($socket, "EHLO " . gethostname(), 250)) {
    fclose($socket);
    exit(1);
}

if ($sslMode === 'tls' || ($port === 587 && $sslMode !== 'ssl')) {
    if (!sendSmtp($socket, "STARTTLS", 220)) {
        fclose($socket);
        exit(1);
    }
    $crypto = stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT);
    if (!$crypto) {
        logMsg("ERROR al iniciar cifrado TLS.");
        fclose($socket);
        exit(1);
    }
    if (!sendSmtp($socket, "EHLO " . gethostname(), 250)) {
        fclose($socket);
        exit(1);
    }
}

if (!empty($username) && !empty($password)) {
    if (!sendSmtp($socket, "AUTH LOGIN", 334)) {
        fclose($socket);
        exit(1);
    }
    if (!sendSmtp($socket, base64_encode($username), 334)) {
        fclose($socket);
        exit(1);
    }
    if (!sendSmtp($socket, base64_encode($password), 235)) {
        logMsg("ERROR de autenticacion en Gmail. Verifica tu contrasena de aplicacion de 16 caracteres.");
        fclose($socket);
        exit(1);
    }
}

if (!sendSmtp($socket, "MAIL FROM:<" . $from . ">", 250)) {
    fclose($socket);
    exit(1);
}

foreach ($recipients as $toAddr) {
    if (!sendSmtp($socket, "RCPT TO:<" . $toAddr . ">", 250)) {
        fclose($socket);
        exit(1);
    }
}

if (!sendSmtp($socket, "DATA", 354)) {
    fclose($socket);
    exit(1);
}

$normalizedEmail = preg_replace("/(?<!\r)\n/", "\r\n", $rawEmail);
$normalizedEmail = preg_replace("/\r\n\./", "\r\n..", $normalizedEmail);
fwrite($socket, $normalizedEmail . "\r\n.\r\n");

$dataRes = readSmtp($socket);
if (substr($dataRes, 0, 3) !== '250') {
    logMsg("ERROR al transmitir mensaje: " . trim($dataRes));
    fclose($socket);
    exit(1);
}

sendSmtp($socket, "QUIT", 221);
fclose($socket);

logMsg("EXITO: Correo enviado correctamente a " . implode(', ', $recipients));
exit(0);
