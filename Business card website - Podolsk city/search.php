<?php
// Подключение к базе данных
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "myDB";

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Обработка запроса
if (isset($_POST['submit'])) {
    $search = mysqli_real_escape_string($conn, $_POST['search']);

    // Извлечение данных из базы данных
    $sql = "SELECT * FROM places WHERE name LIKE '%$search%'";
    $result = mysqli_query($conn, $sql);
    $queryResult = mysqli_num_rows($result);

    // Отображение результатов
    if ($queryResult > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            echo "<div>";
            echo "<h3>".$row['name']."</h3>";
            echo "<p>".$row['description']."</p>";
            echo "</div>";
        }
    } else {
        echo "Нет результатов, соответствующих вашему запросу.";
    }
}

// Закрытие соединения с базой данных
mysqli_close($conn);
?>