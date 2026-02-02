<?php
// Настройки подключения
$servername = "172.16.1.98";
$username = "portfolioivanimkattano"; // ваш пользователь MySQL
$password = "QwerZxc924015";     // пароль пользователя MySQL
$dbname = "db_portfolioivanimkattano";

// Создаём подключение
$conn = new mysqli($servername, $username, $password, $dbname);

// Проверяем подключение
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Получаем данные из формы и экранируем их
$name = $conn->real_escape_string($_POST['name']);
$email = $conn->real_escape_string($_POST['email']);
$message = $conn->real_escape_string($_POST['message']);

// SQL-запрос для вставки данных
$sql = "INSERT INTO contacts (name, email, message) VALUES ('$name', '$email', '$message')";

if ($conn->query($sql) === TRUE) {
    echo "Data sent successfully!";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

// Закрываем подключение
$conn->close();
?>
