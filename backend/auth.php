<?php
session_start();
require_once "config.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['action'])) {
        if ($_POST['action'] == 'login') {
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = $_POST['password'];
            
            $sql = "SELECT id, email, password FROM users WHERE email = ?";
            if ($stmt = mysqli_prepare($conn, $sql)) {
                mysqli_stmt_bind_param($stmt, "s", $email);
                
                if (mysqli_stmt_execute($stmt)) {
                    mysqli_stmt_store_result($stmt);
                    
                    if (mysqli_stmt_num_rows($stmt) == 1) {
                        mysqli_stmt_bind_result($stmt, $id, $email, $hashed_password);
                        if (mysqli_stmt_fetch($stmt)) {
                            if (password_verify($password, $hashed_password)) {
                                $_SESSION["loggedin"] = true;
                                $_SESSION["id"] = $id;
                                $_SESSION["email"] = $email;
                                echo json_encode(["success" => true]);
                                exit;
                            }
                        }
                    }
                }
            }
            echo json_encode(["success" => false, "message" => "Invalid email or password."]);
        } elseif ($_POST['action'] == 'register') {
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
            
            $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
            if ($stmt = mysqli_prepare($conn, $sql)) {
                mysqli_stmt_bind_param($stmt, "ss", $email, $password);
                
                if (mysqli_stmt_execute($stmt)) {
                    echo json_encode(["success" => true]);
                    exit;
                }
            }
            echo json_encode(["success" => false, "message" => "Registration failed."]);
        } elseif ($_POST['action'] == 'contact') {
            $name = mysqli_real_escape_string($conn, $_POST['name']);
            $email = mysqli_real_escape_string($conn, $_POST['email']);
            $message = mysqli_real_escape_string($conn, $_POST['message']);
            
            $to = "ghostsector@icloud.com";
            $subject = "New Contact Form Submission";
            $headers = "From: $email\r\n";
            $headers .= "Reply-To: $email\r\n";
            $headers .= "Content-Type: text/html\r\n";
            
            $email_content = "
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> $name</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Message:</strong><br>$message</p>
            ";
            
            if(mail($to, $subject, $email_content, $headers)) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "message" => "Failed to send message."]);
            }
        }
    }
}
?>
