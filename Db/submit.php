<?php

// Load environment variables from .env file if it exists
$envFile = dirname(dirname(__FILE__)) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

// Get database credentials from environment variables
$servername = getenv('DB_HOST') ?: 'localhost';
$username = getenv('DB_USER') ?: 'root';
$password = getenv('DB_PASSWORD') ?: '';
$dbname = getenv('DB_NAME') ?: 'portfolio';

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    $name = isset($_POST['name']) ? $_POST['name'] : '';
    $email = isset($_POST['email']) ? $_POST['email'] : '';
    $message = isset($_POST['message']) ? $_POST['message'] : '';
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        echo "All fields are required!";
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format!";
        exit;
    }
    
    // Prepared statement to prevent SQL injection
    $stmt = $conn->prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    
    if ($stmt === false) {
        echo "Error preparing statement: " . $conn->error;
        exit;
    }
    
    // Bind parameters
    $stmt->bind_param("sss", $name, $email, $message);
    
    // Execute the prepared statement
    if ($stmt->execute()) {
        echo "Data sent successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }
    
    $stmt->close();
} else {
    echo "Invalid request method!";
}

$conn->close();
?>
