<?php
    session_start();
    require_once 'connect.php';

    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password_confirm = $_POST['password_confirm'];
    if (empty($username) || empty($email) || empty($password) || empty($password_confirm)) {
        $_SESSION['messageok'] = 'заполните все поля';
        header('Location: /pd/forma.php');
    } else if($password !== $password_confirm) {
        $_SESSION['messageok'] = 'пароли не совпадают';
        header('Location: /pd/forma.php');
    } else{
        $mysqli = new mysqli('localhost', 'root', 'root', 'places');
        $stmt = $mysqli->prepare("SELECT * FROM users WHERE email=?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $_SESSION['messageok'] = 'пользователь с таким email уже зарегистрирован';
            header('Location: /pd/forma.php');
        } else {
            $stmt = $mysqli->prepare("INSERT INTO `users` (`email`, `password`, `username`) VALUES ('$email', '$password', '$username')");
            $stmt->execute();
            $stmt->close();
            $mysqli->close();
            $_SESSION['messageok'] = 'вы успешно зарегистрировались';
            header('Location: /pd/forma.php');
        }
    }
?>
