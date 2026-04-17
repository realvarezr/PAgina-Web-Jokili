<?php
/**
 * enviar-contacto.php — Jokili Verein
 * Recibe el formulario de contacto y envía el mensaje por correo.
 */

// Suprimir errores PHP en la salida (evita romper el JSON)
ini_set('display_errors', 0);
error_reporting(0);

header('Content-Type: application/json; charset=utf-8');

// ── Destino ────────────────────────────────────────────────
define('DESTINO',        'contacto@tovarerjokili.com');
define('FROM_EMAIL',     'contacto@tovarerjokili.com');
define('FROM_NOMBRE',    'Web Jokili Verein');
define('ASUNTO_PREFIX',  '[Jokili Web] ');

// ── Solo POST ──────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Método no permitido']);
    exit;
}

// ── Honeypot anti-spam ─────────────────────────────────────
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// ── Leer y limpiar campos ──────────────────────────────────
function limpiar(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

$nombre  = limpiar($_POST['nombre']  ?? '');
$email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$asunto  = limpiar($_POST['asunto']  ?? '');
$mensaje = limpiar($_POST['mensaje'] ?? '');

// ── Validación básica ──────────────────────────────────────
if ($nombre === '' || $mensaje === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Nombre y mensaje son obligatorios']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Correo electrónico inválido']);
    exit;
}

// ── Construir correo ───────────────────────────────────────
$asunto_final = ASUNTO_PREFIX . ($asunto !== '' ? $asunto : 'Nuevo mensaje de contacto');

$cuerpo  = "Nuevo mensaje desde el formulario de contacto de tovarerjokili.com\n";
$cuerpo .= str_repeat('-', 55) . "\n\n";
$cuerpo .= "Nombre:  $nombre\n";
$cuerpo .= "Correo:  $email\n";
$cuerpo .= "Asunto:  " . ($asunto !== '' ? $asunto : '(sin asunto)') . "\n\n";
$cuerpo .= "Mensaje:\n$mensaje\n\n";
$cuerpo .= str_repeat('-', 55) . "\n";
$cuerpo .= "Enviado desde: tovarerjokili.com\n";

$headers  = "From: " . FROM_NOMBRE . " <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: $nombre <$email>\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ── Enviar ─────────────────────────────────────────────────
$enviado = mail(
    DESTINO,
    $asunto_final,
    $cuerpo,
    $headers
);

if ($enviado) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'El servidor no pudo enviar el mensaje. Contacta directamente a contacto@tovarerjokili.com']);
}
