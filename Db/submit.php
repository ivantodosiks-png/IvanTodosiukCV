<?php
// ===== НАСТРОЙКИ БАЗЫ =====
$host = "172.16.1.98";
$db   = "db_portfolioivanimkattano";
$user = "portfolioivanimkattano";
$pass = "QwerZxc924015";
$charset = "utf8mb4";

// ===== PDO ПОДКЛЮЧЕНИЕ =====
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
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
