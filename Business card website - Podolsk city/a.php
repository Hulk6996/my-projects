<!DOCTYPE html>
<html>
  <head>
    <title>Поиск</title>
    <link rel="stylesheet" type="text/css" href="a.css">
    <link rel="stylesheet" href="fontawesome-free-6.4.0-web/css/all.min.css">
  </head>
  <body>
    <div class="search-container">
      <form method="post">
        <input class="search" type="text" name="search_query" placeholder="Поиск...">
        <button class="btsearch" type="submit"><i class="fa fa-search"></i></button>
      </form>
    </div>
    <main>    
      <div class="search-results results">
        <?php
        include 'connect.php';
        if (isset($_POST['search_query'])) {
          $search_query = $_POST['search_query'];
          
          $query = "SELECT * FROM top WHERE title LIKE '%$search_query%' OR description LIKE '%$search_query%'";

          $result = mysqli_query($conn, $query);
      if (mysqli_num_rows($result) > 0) {
        while ($row = mysqli_fetch_assoc($result)) {
            echo '<a class="none" href="place.php?id=' . $row['id'] . '"><div class="place result">';
          echo '<img src="' . $row['path'] . '" alt="' . $row['title'] . '">';
          echo '<h2>' . $row['title'] . '</h2>';
          echo '</div></a>';
        }
      } else {
        echo '<p>Места по таким предпочтениям не найдены.</p>';
      }

      mysqli_close($conn);
    }
    ?>
  </div>
</main>
  </body>
</html>




