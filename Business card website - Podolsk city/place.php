<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "places";
$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
if(isset($_GET['id'])) {
  $id = $_GET['id'];

  $stmt = $conn->prepare('SELECT * FROM top WHERE id = :id');
  $stmt->bindParam(':id', $id);
  $stmt->execute();
  $place = $stmt->fetch(PDO::FETCH_ASSOC);

  if(!$place) {
    header('Location: a.php');
    exit;
  }
} else {
  header('Location: a.php');
  exit;
}
?>

<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title><?php echo $place['title'] ?></title>
  <link rel="stylesheet" href="place.css">
</head>
<body>
  <header>
    <h1 class="title"><?php echo $place['title'] ?></h1>
    <nav>
      <a href="a.php" class="back-button">слив</a>
    </nav>
  </header>
  <main>
    <div class="place">
      <img src="<?php echo $place['path'] ?>" alt="<?php echo $place['title'] ?>">
      <p><?php echo $place['description'] ?></p>
      <p><a href="https://yandex.ru/maps/?text=<?php echo urlencode($place['address']) ?>" target="_blank"><?php echo $place['address'] ?></a></p>
      <p>График работы: <?php echo $place['working_hours'] ?></p>
      <p>Цены: <?php echo $place['prices'] ?></p>
    </div>
	<div class="reviews-container">
  <h2>Отзывы</h2>
  <?php
session_start();
include 'connect.php';
if (isset($_SESSION['id']) && isset($_SESSION['username'])) {
    $user_id = mysqli_real_escape_string($conn, $_SESSION['id']);
    $username = mysqli_real_escape_string($conn, $_SESSION['username']);
    if (isset($_GET['id'])) {
        $place_id = mysqli_real_escape_string($conn, $_GET['id']);
        echo '<form method="post" class="review-form">';
        echo '<input type="hidden" name="place_id" value="' . htmlspecialchars($place_id) . '">';
        echo '<input type="hidden" name="user_id" value="' . htmlspecialchars($user_id) . '">';
        echo '<input type="hidden" name="username" value="' . htmlspecialchars($username) . '">';
        echo '<textarea name="review" placeholder="Оставьте отзыв"></textarea>';
        echo '<button type="submit" name="submit_review">Отправить</button>';
        echo '</form>';
    } else {
        echo '<p>Место не указано.</p>';
    }
    if (isset($_POST['submit_review'])) {
		if (isset($_POST['review']) && !empty(trim($_POST['review'])) && isset($_POST['user_id']) && isset($_POST['username']) && isset($_POST['place_id'])) {
			$review = mysqli_real_escape_string($conn, $_POST['review']);
			$place_id = mysqli_real_escape_string($conn, $_POST['place_id']);
			$user_id = mysqli_real_escape_string($conn, $_POST['user_id']);
			$username = mysqli_real_escape_string($conn, $_POST['username']);
if (isset($_SESSION['last_review']) && $_SESSION['last_review'] == $review) {
    echo '<p></p>';
} else {
    $query = "INSERT INTO `reviews` (`place_id`, `user_id`, `username`, `text`, `created_at`) VALUES ('$place_id', '$user_id', '$username', '$review', NOW())";
    $_SESSION['last_review'] = $review;
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo '<p>Отзыв успешно добавлен!</p>';
    } else {
        if (mysqli_errno($conn) == 1062) {
            echo '<p>Вы уже оставляли отзыв на это место.</p>';
        } else {
            echo '<p>Произошла ошибка при добавлении отзыва.</p>';
        }
    }
}
		} else {
			echo '<p></p>';
		}
        } else {
            echo '<p></p>';
        }
    } else {
    echo '<p>Чтобы оставить отзыв, пожалуйста, <a href="/pd/forma.php">авторизуйтесь</a>.</p>';
}
if (isset($_GET['id'])) {
	$place_id = mysqli_real_escape_string($conn, $_GET['id']);

	$query = "SELECT text AS review, created_at, user_id, username 
  FROM reviews WHERE place_id = $place_id ORDER BY created_at DESC";
	
  $result = mysqli_query($conn, $query);
	if(mysqli_num_rows($result) > 0) {
		while($row = mysqli_fetch_assoc($result)) {
			$review = $row['review'];
			$created_at = $row['created_at'];
			$username = $row['username'];
	
			echo "<div class='review'>";
			echo "<h3>$username</h3>";
			echo "<p>$review</p>";
			echo "<span class='date'>$created_at</span>";
			echo "</div>";
		}
	} else {
		echo "<p>No reviews yet.</p>";
	}
	}
	
	mysqli_close($conn);
	?>
	
	</div>
	  </main>
	</body>
	</html>