<?php
declare(strict_types=1);

/**
 * Virsha Arif — contact handler
 * Expects POST from the portfolio form. Returns JSON for AJAX, HTML otherwise.
 */

const RECIPIENT = 'virshaarif59@gmail.com';
const SITE_NAME = 'Virsha Arif Portfolio';
const MAX_PER_HOUR = 8;
const LOG_FILE = __DIR__ . '/storage/messages.jsonl';

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

$accept = (string) ($_SERVER['HTTP_ACCEPT'] ?? '');
$wantsJson = (
    strpos($accept, 'application/json') !== false
    || (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower((string) $_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest')
);

function field_len(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function respond(bool $ok, string $message, int $code = 200, bool $json = true): void
{
    http_response_code($code);
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    $title = $ok ? 'Message sent' : 'Could not send';
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'
        . $title
        . '</title><link rel="stylesheet" href="style.css"></head><body style="min-height:100vh;display:grid;place-items:center;padding:2rem">'
        . '<div style="max-width:32rem;text-align:center"><p class="section-index">[ CONTACT ]</p><h1 class="chapter-title">'
        . $title
        . '</h1><p class="chapter-lead" style="margin:1rem auto 2rem">'
        . $safe
        . '</p><a class="btn-outline" href="index.html#contact">Back to portfolio</a></div></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'This endpoint only accepts form submissions.', 405, $wantsJson);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

$now = time();
$hits = $_SESSION['contact_hits'] ?? [];
$hits = array_values(array_filter($hits, static fn ($t) => ($now - (int) $t) < 3600));
if (count($hits) >= MAX_PER_HOUR) {
    respond(false, 'Too many messages from this session. Please try again later or email me directly.', 429, $wantsJson);
}

$honeypot = trim((string) ($_POST['website'] ?? ''));
if ($honeypot !== '') {
    $hits[] = $now;
    $_SESSION['contact_hits'] = $hits;
    respond(true, 'Message received. I’ll get back to you shortly.', 200, $wantsJson);
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$errors = [];
if (!preg_match("/^[A-Za-zÀ-ÿ\\s'.-]{3,80}$/u", $name)) {
    $errors[] = 'name';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'email';
}
if (field_len($subject) < 3 || field_len($subject) > 140) {
    $errors[] = 'subject';
}
if (field_len($message) < 12 || field_len($message) > 4000) {
    $errors[] = 'message';
}

if ($errors) {
    respond(false, 'Please check your details and try again.', 422, $wantsJson);
}

$cleanEmail = filter_var($email, FILTER_SANITIZE_EMAIL);

$mailSubject = '[' . SITE_NAME . '] ' . $subject;
$body = "New portfolio enquiry\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Subject: {$subject}\n"
    . "IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "\n"
    . "Time: " . gmdate('c') . "\n\n"
    . $message . "\n";

$encodedFrom = '=?UTF-8?B?' . base64_encode($name) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $encodedFrom . ' <' . RECIPIENT . '>',
    'Reply-To: ' . $cleanEmail,
    'X-Mailer: PHP/' . PHP_VERSION,
];

$sent = @mail(RECIPIENT, '=?UTF-8?B?' . base64_encode($mailSubject) . '?=', $body, implode("\r\n", $headers));

$dir = dirname(LOG_FILE);
if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
}
if (is_dir($dir) && is_writable($dir)) {
    $record = json_encode([
        'at' => gmdate('c'),
        'name' => $name,
        'email' => $email,
        'subject' => $subject,
        'message' => $message,
        'mailed' => $sent,
    ], JSON_UNESCAPED_UNICODE);
    if ($record) {
        @file_put_contents(LOG_FILE, $record . PHP_EOL, FILE_APPEND | LOCK_EX);
    }
}

$hits[] = $now;
$_SESSION['contact_hits'] = $hits;

if (!$sent) {
    respond(
        true,
        'Your note was saved. If you do not hear back, write directly to ' . RECIPIENT . '.',
        200,
        $wantsJson
    );
}

respond(true, 'Message received. I’ll get back to you shortly.', 200, $wantsJson);
