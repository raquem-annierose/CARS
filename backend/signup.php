<?php
require_once '../database/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $first_name = $_POST['first_name'] ?? '';
    $last_name = $_POST['last_name'] ?? '';
    $middle_name = $_POST['middle_name'] ?? null;
    $unit_number = $_POST['unit_number'] ?? '';
    $building = $_POST['building'] ?? '';
    $contact_number = $_POST['contact_number'] ?? '';

    // Validate required fields
    if (empty($username) || empty($email) || empty($password) || empty($first_name) || empty($last_name) || empty($unit_number) || empty($building)) {
        http_response_code(400);
        echo json_encode(['error' => 'Please fill in all required fields.']);
        exit;
    }

    try {
        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT * FROM Users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->rowCount() > 0) {
            http_response_code(409);
            echo json_encode(['error' => 'Username or email already exists.']);
            exit;
        }

        // Insert into Users table with role 'resident'
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO Users (username, email, password_hash, role) VALUES (?, ?, ?, 'resident')");
        $stmt->execute([$username, $email, $password_hash]);
        $user_id = $pdo->lastInsertId();

        // Insert into Resident table
        $stmt = $pdo->prepare("INSERT INTO Resident (user_id, last_name, first_name, middle_name, unit_number, building, contact_number)
                               VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$user_id, $last_name, $first_name, $middle_name, $unit_number, $building, $contact_number]);

        echo json_encode(['success' => 'Account created successfully!']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
    }
}
?>
