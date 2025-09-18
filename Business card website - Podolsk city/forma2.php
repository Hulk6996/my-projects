<?php
    session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ===== Iconscout CSS ===== -->
    <link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.0/css/line.css">

    <!-- ===== CSS ===== -->
    <link rel="stylesheet" href="style.css">
         
    <title>Login & Registration Form</title>
</head>
<body>
    
    <div class="container">
        <div class="forms">
            <!-- Registration Form -->
            <div class="form signup">
                <span class="title">Registration</span>

                <form  action="register.php" method="post">
                    <div class="input-field">
                        <input type="text" name="username" placeholder="Enter your name" required>
                        <i class="uil uil-user"></i>
                    </div>
                    <div class="input-field">
                        <input type="text" name="email" placeholder="Enter your email" required>
                        <i class="uil uil-envelope icon"></i>
                    </div>
                    <div class="input-field">
                        <input type="password" name="password" class="password" placeholder="Create a password" required>
                        <i class="uil uil-lock icon"></i>
                    </div>
                    <div class="input-field">
                        <input type="password" name="password_confirm" class="password" placeholder="Confirm a password" required>
                        <i class="uil uil-lock icon"></i>
                        <i class="uil uil-eye-slash showHidePw"></i>
                    </div>

                    <div class="checkbox-text">
                        <div class="checkbox-content">
                            <input type="checkbox" id="termCon">
                            <label for="termCon" class="text">I accepted all terms and conditions</label>
                        </div>
                    </div>
                    <?php
                     if($_SESSION['message']){
                        echo '<p class="message">' . $_SESSION['message']  . ' </p>';
                     }
                     unset($_SESSION['message']);
                     ?>
                    <div class="input-field button">
                        <input type="submit" value="Signup">
                    </div>
                </form>
                <div class="login-signup">
                    <span class="text">Already a member?
                        <a href="forma.php" class="text login-link">Login Now</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>