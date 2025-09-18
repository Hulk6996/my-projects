<?php
session_start();
require_once 'connect.php';

$email = $_POST['email'];
$password = $_POST['password'];

$mysql = new mysqli('localhost', 'root', 'root', 'places');
$result = $mysql->query("SELECT * FROM `users` WHERE `email` = '$email' AND `password` = '$password'");
$num_rows = $result->num_rows;

if($num_rows == 0){
  $_SESSION['message1'] = "неверные данные";
  header('Location: /pd/forma.php');
}else{
  $row = $result->fetch_assoc();
  $_SESSION['id'] = $row['id'];
  $_SESSION['username'] = $row['username'];
  
  $mysql->close();
  header('Location: /pd/a.php');
}
?>