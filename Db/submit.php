<?php
// ===== Настройки базы =====
$host = "172.16.1.98";  // если на школьном сервере localhost
$db   = "db_portfolioivanimkattano";
$user = "portfolioivanimkattano";
$pass = "QwerZxc924015";

// Подключаемся через PDO
try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    exit("Ошибка подключения к базе: " . $e->getMessage());
}

// ===== Проверка, что данные пришли =====
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
$stmt = $pdo->prepare("INSERT INTO contacts (name, email, message) VALUES (:name, :email, :message)");
$stmt->execute([
    ':name'    => $name,
    ':email'   => $email,
    ':message' => $message
]);

echo "Сообщение отправлено!";
