<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web-shop mobitelii</title>
    <!-- link rel="stylesheet" href="../css/stil.css" -->
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 

</head>

<body>
    <div class="w3-container">
        <nav>
            <div class="w3-bar w3-black">
                <a href="../php/index.php" class="w3-bar-item w3-button">Početna stranica</a>
                <a href="" class="w3-bar-item w3-button">Sve ponude</a>
                <a href="../html/kontakt.html" class="w3-bar-item w3-button">Oglasi se</a>
                <a href="../html/prijava.html" style="float: right" class ="w3-bar-item w3-button">Prijava</a>
                <a href="../html/registracija.html" style="float: right" class="w3-bar-item w3-button">Registracija</a>
            </div>          
        </nav>
    </div>
    <div class="w3-container">
    <h1>Web shop - mobiteli</h1>    
    <p></p>
    <?php
      $server = "ucka.veleri.hr:3306";
      $database = "adumicic";
      $username = "adumicic";
      $password = "11";
  
      $conn = mysqli_connect($server, $username, $password, $database);
      
      $query = "SELECT * FROM OGLAS";
     // $query = "SELECT * FROM OGLAS RIGHT OUTER join FOTOGRAFIJE ON OGLAS.ID_oglasa = FOTOGRAFIJE.ID_oglasa ";
      $res = mysqli_query($conn, $query);
    ?>
    <div>Popis svih oglasa:
        <table class="w3-table-all">
            <tr class="w3-red">
               
                <th>Šifra oglasa</th>
                <th>Naziv oglasa</th>
                <th>Marka</th>
                <th>Model</th>
                <th>Godište</th>
                <th>Kilometri</th>
                <th>Opis oglasa</th>
                <th>Slika</th>
            </tr>
            <?php
             while($row = mysqli_fetch_array($res)){
                echo "<tr>";
                
                echo "<td>".$row['ID_oglasa']."</td>";
                echo "<td>".$row['naziv_oglasa']."</td>";
                echo "<td>".$row['marka']."</td>";
                echo "<td>".$row['model']."</td>";
                echo "<td>".$row['godiste']."</td>";
                echo "<td>".$row['km']."</td>";
                echo "<td>".$row['opis_oglasa']."</td>";
                //echo "<td><img src='".$row['link_foto']."' width='100px' alt='".$row['ID_oglasa']."'></td>";
    
                echo "</tr>";
            }
            
            mysqli_close($conn);
            ?>

        </table>
        
    </div>
    </div>
</body>
</html>