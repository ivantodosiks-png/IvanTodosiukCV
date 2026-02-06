<?php
// ===== Загрузка переменных окружения из .env =====
function loadDotEnv(string $path): void
{
    if (!file_exists($path)) {
        return;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        if (!str_contains($line, '=')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) || (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
    }
}

// Попробуем загрузить .env из корня проекта (один уровень выше папки Db)
loadDotEnv(dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env');

// ===== НАСТРОЙКИ БАЗЫ (из окружения) =====
$host = getenv('DB_HOST') ?: null;
$db   = getenv('DB_NAME') ?: null;
$user = getenv('DB_USER') ?: null;
$pass = getenv('DB_PASS') ?: null;
$charset = getenv('DB_CHARSET') ?: 'utf8mb4';

// Если какие-то параметры не заданы — даём нейтральную ошибку
if (!$host || !$db || !$user || $pass === null) {
    http_response_code(500);
    exit("Database credentials are not configured. Please copy .env.example to .env and set values.");
}

// ===== PDO ПОДКЛЮЧЕНИЕ =====
$dsn = "mysql:host={$host};dbname={$db};charset={$charset}";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    http_response_code(500);
    exit("Database connection failed");
}

// ===== ПРОВЕРКА POST =====
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Method not allowed");
}

// ===== ОЧИСТКА ДАННЫХ =====
$name    = trim($_POST["name"] ?? "");
$email   = trim($_POST["email"] ?? "");
$message = trim($_POST["message"] ?? "");

if ($name === "" || $email === "" || $message === "") {
    http_response_code(400);
    exit("Missing required fields");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit("Invalid email");
}

// ===== ЗАПИСЬ В БД =====
$stmt = $pdo->prepare(
    "INSERT INTO contacts (name, email, message)
     VALUES (:name, :email, :message)"
);

$stmt->execute([
    ":name"    => $name,
    ":email"   => $email,
    ":message" => $message
]);

// ===== ОТВЕТ =====
echo "OK";
