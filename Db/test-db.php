<?php
header('Content-Type: application/json; charset=utf-8');
// Minimal DB connectivity tester for debugging (safe: does not reveal credentials)
$response = ['ok' => false];

// load .env like submit.php
$envFile = dirname(__FILE__) . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        $parts = explode('=', $line, 2);
        if (count($parts) < 2) continue;
        list($key, $value) = $parts;
        $k = trim($key); $v = trim($value);
        $_ENV[$k] = $v;
        $_SERVER[$k] = $v;
    }
}

$host = getenv('DB_HOST'); if ($host === false || $host === '') $host = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
$user = getenv('DB_USER'); if ($user === false || $user === '') $user = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
$pass = getenv('DB_PASSWORD'); if ($pass === false) $pass = isset($_ENV['DB_PASSWORD']) ? $_ENV['DB_PASSWORD'] : '';
$name = getenv('DB_NAME'); if ($name === false || $name === '') $name = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'portfolio';

$response['db_host'] = $host;
$response['db_name'] = $name;

// attempt connect
$mysqli = @new mysqli($host, $user, $pass, $name);
if ($mysqli->connect_errno) {
    http_response_code(500);
    $response['error'] = 'connect_failed';
    $response['message'] = $mysqli->connect_error;
    echo json_encode($response, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
    exit;
}

// set charset
if (!$mysqli->set_charset('utf8mb4')) {
    $response['charset_set'] = false;
} else {
    $response['charset_set'] = true;
    $response['charset'] = $mysqli->character_set_name();
}

// check table exists
$res = $mysqli->query("SHOW TABLES LIKE 'contacts'");
$response['table_exists'] = ($res && $res->num_rows > 0) ? true : false;

// mysql version
$response['mysql_version'] = $mysqli->server_info;
$response['ok'] = true;

$mysqli->close();

echo json_encode($response, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
