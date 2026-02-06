<?php
// ===== Читаем .env =====
$env = parse_ini_file(__DIR__ . '/../.env'); // ../ если submit.php в Db/
foreach ($env as $key => $value) {
    $_ENV[$key] = $value;
}

// ===== Настройки базы =====
$host = $_ENV['DB_HOST'] ?? 'localhost';
$db   = $_ENV['DB_NAME'] ?? 'my_database';
$user = $_ENV['DB_USER'] ?? 'my_user';
$pass = $_ENV['DB_PASS'] ?? 'my_password';

// Подключаемся через PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    exit("Feil ved tilkobling til database: " . $e->getMessage());
}

// ===== Проверка, что данные пришли =====
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    exit("Metoden er ikke tillatt");
}

$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    exit("Fyll ut alle feltene");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit("Ugyldig e-post");
}

// ===== Вставка в базу =====
$stmt = $pdo->prepare("INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)");
$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':message' => $message
]);

echo "Melding sendt!";
