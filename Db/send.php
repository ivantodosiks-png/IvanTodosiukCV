<?php
// Включаем вывод ошибок, чтобы увидеть причину HTTP 500 на сервере
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/db.php'; // надёжное подключение базы из той же папки

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // получаем данные из формы и экранируем
    $name    = $conn->real_escape_string($_POST['name'] ?? '');
    $email   = $conn->real_escape_string($_POST['email'] ?? '');
    $message = $conn->real_escape_string($_POST['message'] ?? '');

    // простая проверка
    if ($name === '' || $email === '' || $message === '') {
        die('Alt skal respekteres');
    }

    // SQL-запрос для вставки данных
    $sql = "INSERT INTO messages (name, email, message) VALUES ('$name', '$email', '$message')";

    if ($conn->query($sql) === TRUE) {
        // после успешной отправки возвращаемся на главную к форме
        header('Location: /index.html#contact');
        exit;
    } else {
        // Покажет конкретную ошибку SQL, если что-то не так с таблицей/правами
        die('Databasefeil: ' . $conn->error);
    }
}

// если файл открыли напрямую без POST — просто вернёмся на главную
header('Location: /index.html');
exit;
?>
