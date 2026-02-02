<?php
$host = "localhost"; // phpMyAdmin и база на том же сервере
$db = "db_portfolioivanimkattano";
$user = "portfolioivanimkattano";
$pass = "QwerZxc924015";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Tilkoblingsfeil: " . $conn->connect_error);
}
?>
