<?php

// Production-safe error handling: do NOT display errors to clients
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 1);
// Keep reporting level high but only log errors
error_reporting(E_ALL);

// Load environment variables from .env file if it exists (robust parsing)
$envFile = dirname(dirname(__FILE__)) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
            if ($line === '' || strpos($line, '#') === 0) continue;
            if (strpos($line, '=') === false) continue;
            $parts = explode('=', $line, 2);
            if (count($parts) < 2) continue;
            list($key, $value) = $parts;
            if ($key !== null) {
                $k = trim($key);
                $v = trim($value);
                putenv($k . '=' . $v);
                // also set $_ENV and $_SERVER for compatibility
                $_ENV[$k] = $v;
                $_SERVER[$k] = $v;
            }
    }
}

// Get database credentials from environment variables
$servername = getenv('DB_HOST');
if ($servername === false || $servername === '') {
    $servername = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
}
$username = getenv('DB_USER');
if ($username === false || $username === '') {
    $username = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
}
$password = getenv('DB_PASSWORD');
if ($password === false) {
    $password = isset($_ENV['DB_PASSWORD']) ? $_ENV['DB_PASSWORD'] : '';
}
$dbname = getenv('DB_NAME');
if ($dbname === false || $dbname === '') {
    $dbname = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'portfolio';
}

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    http_response_code(500);
    error_log('DB connection error: ' . $conn->connect_error);
    die("Connection failed: " . $conn->connect_error);
}
// Ensure connection uses utf8mb4 so multi-byte characters (em-dash, special lines) are preserved
if (!@$conn->set_charset('utf8mb4')) {
    // fallback: try explicit query
    $conn->query("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
    error_log('submit.php: could not set charset with set_charset(), used SET NAMES as fallback.');
}
// Tell client responses are utf-8
header('Content-Type: text/plain; charset=utf-8');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $message = isset($_POST['message']) ? $_POST['message'] : '';
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo "All fields are required!";
        error_log('submit.php: validation failed - empty fields');
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid email format!";
        error_log('submit.php: validation failed - invalid email: ' . $email);
        exit;
    }
    
    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    
    if ($stmt === false) {
        http_response_code(500);
        error_log('submit.php: prepare failed - ' . $conn->error);
        echo "Server error";
        exit;
    }
    
    // Bind parameters
    $stmt->bind_param("sss", $name, $email, $message);
    
    // Execute the prepared statement
    if ($stmt->execute()) {
        http_response_code(200);
        echo "Data sent successfully!";
    } else {
        http_response_code(500);
        error_log('submit.php: execute failed - ' . $stmt->error);
        echo "Server error";
    }
    
    $stmt->close();
} else {
    echo "Invalid request method!";
}

$conn->close();
?>
