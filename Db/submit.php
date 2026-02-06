<?php
// ===== Загрузка переменных окружения из .env =====
function loadDotEnvPaths(array $paths): void
{
    foreach ($paths as $path) {
        if (!is_string($path) || $path === '') {
            continue;
        }

        if (!file_exists($path)) {
            continue;
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

        // stop after first existing file is loaded
        return;
    }
}

// Попробуем загрузить .env из нескольких мест: корень проекта, папка Db, текущая рабочая директория
$candidateEnv = [
    dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env',
    __DIR__ . DIRECTORY_SEPARATOR . '.env',
    getcwd() . DIRECTORY_SEPARATOR . '.env',
];
loadDotEnvPaths($candidateEnv);

// Fallback: directly parse the first existing .env file into an array (avoid relying on getenv/$_ENV availability)
function parseEnvFile(string $path): array
{
    $result = [];
    if (!file_exists($path)) {
        return $result;
    }

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$name, $value] = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) || (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }
        $result[$name] = $value;
    }

    return $result;
}

// find first existing .env path
$foundEnvPath = null;
foreach ($candidateEnv as $p) {
    if (is_string($p) && file_exists($p)) {
        $foundEnvPath = $p;
        break;
    }
}

if ($foundEnvPath) {
    $envFromFile = parseEnvFile($foundEnvPath);
    // set missing vars from parsed file
    $host = $host ?: ($envFromFile['DB_HOST'] ?? $host);
    $db   = $db   ?: ($envFromFile['DB_NAME'] ?? $db);
    $user = $user ?: ($envFromFile['DB_USER'] ?? $user);
    // accept both DB_PASS and DB_PASSWORD
    $pass = ($pass !== null && $pass !== false) ? $pass : ($envFromFile['DB_PASS'] ?? ($envFromFile['DB_PASSWORD'] ?? $pass));
    $charset = $charset ?: ($envFromFile['DB_CHARSET'] ?? $charset);

    error_log('submit.php loaded env from: ' . $foundEnvPath);
}

// DEBUG flag (set DEBUG=true in .env to get more details in response)
$debug = strtolower((getenv('DEBUG') ?: ($_ENV['DEBUG'] ?? 'false')));
$debugEnabled = in_array($debug, ['1','true','yes'], true);

// Log presence (not values) of DB variables for debugging
error_log(sprintf("submit.php env check: DB_HOST=%s, DB_NAME=%s, DB_USER=%s, DB_PASS_SET=%s, DB_CHARSET=%s, DEBUG=%s",
    ($host ? 'yes' : 'no'),
    ($db ? 'yes' : 'no'),
    ($user ? 'yes' : 'no'),
    ($pass !== null && $pass !== false ? 'yes' : 'no'),
    ($charset ?: 'none'),
    ($debugEnabled ? 'yes' : 'no')
));

// ===== НАСТРОЙКИ БАЗЫ (из окружения) =====
$host = getenv('DB_HOST') ?: ($_ENV['DB_HOST'] ?? null);
$db   = getenv('DB_NAME') ?: ($_ENV['DB_NAME'] ?? null);
$user = getenv('DB_USER') ?: ($_ENV['DB_USER'] ?? null);
$pass = getenv('DB_PASS') ?: (getenv('DB_PASSWORD') ?: ($_ENV['DB_PASS'] ?? ($_ENV['DB_PASSWORD'] ?? null)));
$charset = getenv('DB_CHARSET') ?: ($_ENV['DB_CHARSET'] ?? 'utf8mb4');

// Если какие-то параметры не заданы — даём нейтральную ошибку
if (empty($host) || empty($db) || empty($user) || ($pass === null || $pass === false)) {
    $missing = [];
    if (empty($host)) { $missing[] = 'DB_HOST'; }
    if (empty($db)) { $missing[] = 'DB_NAME'; }
    if (empty($user)) { $missing[] = 'DB_USER'; }
    if ($pass === null || $pass === false) { $missing[] = 'DB_PASS/DB_PASSWORD'; }

    error_log('submit.php: missing DB env vars: ' . implode(',', $missing));
    http_response_code(500);
    if ($debugEnabled) {
        header('Content-Type: text/plain; charset=utf-8');
        exit("Missing DB environment variables: " . implode(', ', $missing));
    }
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
    // Log full exception for server-side debugging
    error_log('submit.php PDOException: ' . $e->getMessage());
    http_response_code(500);
    if ($debugEnabled) {
        header('Content-Type: text/plain; charset=utf-8');
        exit("Database connection failed: " . $e->getMessage());
    }
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
