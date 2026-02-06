<?php
$env = parse_ini_file(__DIR__ . '/.env');

$host = $env['DB_HOST'];  // 172.16.1.98
$port = $env['DB_PORT'] ?? 3306; 
$db   = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];

// Обязательно указываем порт
$dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    exit("Ошибка подключения к базе: " . $e->getMessage());
}

// Проверка POST и вставка данных, как раньше...


// ===== Проверка POST =====
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit("Метод не разрешён");
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    exit("Заполните все поля");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit("Неверный email");
}

// ===== Вставка в базу =====
$stmt = $pdo->prepare(
    "INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)"
);

$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':message' => $message
]);

echo "Сообщение отправлено!";
