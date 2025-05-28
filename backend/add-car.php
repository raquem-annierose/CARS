<?php
require_once '../database/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $model = $_POST['model'] ?? '';

    if (!empty($model)) {
        try {
            $stmt = $pdo->prepare("INSERT INTO cars (model) VALUES (?)");
            $stmt->execute([$model]);
            echo "✅ Car model added successfully!";
        } catch (PDOException $e) {
            echo "❌ Database error: " . $e->getMessage();
        }
    } else {
        echo "❌ Please enter a car model.";
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo "❌ Method not allowed. Use POST.";
}
?>
