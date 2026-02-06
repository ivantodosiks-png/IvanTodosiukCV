<?php
// Читаем .env
$env = parse_ini_file(__DIR__ . '/.env');

$host = $env['DB_HOST'];
$db   = $env['DB_NAME'];
$user = $env['DB_USER'];
$pass = $env['DB_PASS'];

// НЕ указываем charset в DSN
$dsn = "mysql:host=$host;dbname=$db";

try {
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // Устанавливаем кодировку вручную через SQL
    $pdo->exec("SET NAMES 'utf8'");
    $pdo->exec("SET CHARACTER SET utf8");

} catch (PDOException $e) {
    exit("Ошибка подключения к базе: " . $e->getMessage());
}


// ===== Проверяем, что данные пришли =====
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

// ===== Вставляем в базу =====
$stmt = $pdo->prepare("INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)");
$stmt->execute([
    ':name' => $name,
    ':email' => $email,
    ':message' => $message
]);

echo "Сообщение отправлено!";
