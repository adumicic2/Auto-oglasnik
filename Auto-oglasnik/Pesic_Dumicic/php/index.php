<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <!-- link rel="stylesheet" href="../css/stil.css" -->
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 


</head>
<?php
      $server = "ucka.veleri.hr:3306";
      $database = "adumicic";
      $username = "adumicic";
      $password = "11";
  
      $conn = mysqli_connect($server, $username, $password, $database);
      if (!$conn) 
        {
            die("Greška povezivanja: " . mysqli_connect_error());
        }   
      $query = "SELECT DISTINCT link_foto FROM FOTOGRAFIJE ORDER BY RAND() LIMIT 3";
      $res = mysqli_query($conn, $query);
    ?>
<body>
    <div class="w3-container">
        <nav class="navigacija">
            <div class="w3-bar w3-black">
                <a href="" class="w3-bar-item w3-button">Početna stranica</a>
                <a href="../php/sve_ponude.php" class="w3-bar-item w3-button">Sve ponude</a>
                <a href="../html/kontakt.html" class="w3-bar-item w3-button">Kontakt</a>
                <a href="../html/prijava.html" style="float: right" class ="w3-bar-item w3-button">Prijava</a>
                <a href="../html/registracija.html" style="float: right" class="w3-bar-item w3-button">Registracija</a>
            </div>          
        </nav>
    </div>
    <div class="w3-container">
    <h1 style="text-align: center;">AutOglasnik!</h1>    
    <p style="text-align: center;">Odaberite akciju!</p>

    <div class="w3-center">
        <div class="w3-card-4 ">
            <div id="pregledatidiv"class="w3-container w3-red w3-round-large w3-hover-shadow">
              <h4 id="pregledati"><b>Pregledaj oglase</b></h4>
              <style>       
                #pregledatidiv.w3-red:hover {
                   
                    color: #fff; 
                }
        
                #pregledatidiv.w3-gray:hover {
                   
                    color: #fff;
                    cursor: pointer;
                }
            </style>
              
            </div>      
            <div class="w3-dark-grey w3-card-4">
            <?php
             while ($row = mysqli_fetch_assoc($res)) {
                $imageData = $row['link_foto'];
                if (filter_var($imageData, FILTER_VALIDATE_URL)) {
                    $photos[] = $imageData;
                } else {
                    $base64Image = base64_encode($imageData);
                    $photos[] = 'data:image/jpeg;base64,' . $base64Image;
                }
            }
            mysqli_close($conn);
            ?>
                <div class="w3-row-padding">
                <?php
                foreach ($photos as $photo) {
                ?>
                 <div class="w3-col s4 w3-hover-sepia w3-animate-zoom"><img src="<?php echo $photo; ?>" style="width: 300px; height: 300px"></div>
                <?php
                }
                ?>
            </div>           
            </div>      
        </div> 
    </div>
    <div class="w3-center">
        <div class="w3-card-4 ">
            <div id="predajdiv"class="w3-container w3-red w3-round-large w3-animate-bottom w3-hover-shadow w3-half w3-display-middle">
              <h4 id="predaj"><b>Predaj svoj oglas</b></h4>
              <style>       
                #predajdiv.w3-red:hover {
                   
                    color: #fff; 
                }
        
                #predajdiv.w3-gray:hover {
                   
                    color: #fff;
                    cursor: pointer;
                }
                </style>
                <script>
                    function addMouseoverListener(divId) 
                    {
    
                    const divElement = document.getElementById(divId);
    
                    if (divElement) {
                        divElement.addEventListener('mouseover', function() {
                            if (this.classList.contains('w3-red')) {
                                this.classList.remove('w3-red');
                                this.classList.add('w3-gray');
                            } else if (this.classList.contains('w3-gray')) {
                                this.classList.remove('w3-gray');
                                this.classList.add('w3-red');
                            }
                        });
    
                        divElement.addEventListener('mouseout', function() {
                            if (this.classList.contains('w3-red')) {
                                this.classList.remove('w3-red');
                                this.classList.add('w3-gray');
                            } else if (this.classList.contains('w3-gray')) {
                                this.classList.remove('w3-gray');
                                this.classList.add('w3-red');
                            }
                        });
    
                            divElement.addEventListener('click', function() {
                                if(this.id === 'pregledatidiv') window.location.href = '../php/sve_ponude.php';
                                else window.location.href='../html/kontakt.html';                             
                            });
                        }
                    }
                    addMouseoverListener('pregledatidiv');
                    addMouseoverListener('predajdiv');
                </script>  
            </div>
        </div>
    </div>          
    </div>
    </div>
</body>
</html>