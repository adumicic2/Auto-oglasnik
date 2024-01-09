<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Svi oglasi!</title>
    <!-- link rel="stylesheet" href="../css/stil.css" -->
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> 
    <script>
    function potvrdiBrisanje()
    {
        var potvrdica = confirm("Želite li stvarno obrisati sve vaše oglase?");
        if (potvrdica)
        {
            const korisnik_IDbrisanje = localStorage.getItem('localKorisnikID');
            const httpRe = new XMLHttpRequest();

            httpRe.onreadystatechange = function () 
            {
                if (httpRe.readyState === 4) {
                    if (httpRe.status === 200) 
                    {
                        const response = JSON.parse(httpRe.responseText);
                        if (response.error) {
                            alert(`Error: ${response.message}`);
                        } 
                        else 
                        {
                            const affectedRows = response.data.affectedRows;
                            alert(`Obrisano ${affectedRows} oglasa!`);
                            location.reload();
                        }
                    } 
                    else 
                    {
                        alert('Nemate oglasa za brisanje!');
                    }
                }
            };
            httpRe.open("DELETE", `http://localhost:3000/brisiOglase/${korisnik_IDbrisanje}`, true);
            httpRe.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            httpRe.send();
        }
    }
    </script>
</head>

<body>
    <div class="w3-container">
        <nav>
            <div class="w3-bar w3-black">
                <a href="../php/index.php" class="w3-bar-item w3-button">Početna stranica</a>
                <a href="" class="w3-bar-item w3-button">Sve ponude</a>
                <a href="../html/kontakt.html" class="w3-bar-item w3-button">Oglasi se</a>
                <a href="../html/prijava.html" style="float: right" id="prijaodjava" class ="w3-bar-item w3-button">Prijava</a>
                <a href="../html/registracija.html" style="float: right" id="regist" class="w3-bar-item w3-button">Registracija</a>
                <div class="w3-dropdown-hover" style="float: right">
                <button class="w3-button" id="vasUsername" >Dropdown</button>
                <div class="w3-dropdown-content w3-bar-block w3-card-4">
                <a href="../html/izmjena.html" class="w3-bar-item w3-button">Izmijeni broj telefona</a>
                <a href="#" class="w3-bar-item w3-button" onclick="potvrdiBrisanje()">Obrisi oglase</a>
                </div>
                </div>
                <script>
                    var vasUsernameElement = document.getElementById('vasUsername');
                    var prijavaElement = document.getElementById('prijaodjava');
                    var registracijaElement = document.getElementById('regist');

                    var lokalniKorisnikID = localStorage.getItem('localKorisnikID');
                    var lokalniKorisnikIme = localStorage.getItem('localKorisnikIme');

                    if (lokalniKorisnikID && lokalniKorisnikIme) {
                    vasUsernameElement.textContent = `Korisnik: ${lokalniKorisnikIme} (${lokalniKorisnikID})`;
                    prijavaElement.textContent = "Odjava";
                    registracijaElement.style.display = "none";
                    } else {
                    vasUsernameElement.textContent = '';
                    prijavaElement.textContent = "Prijava";
                    registracijaElement.style.display = "block";
                    }
                </script>
            </div>          
        </nav>
    </div>

    <h1 class="w3-center">AutOglasnik</h1> 

    <div class="w3-dropdown-hover w3-left;" style="margin-left: 20%">
        <button class="w3-button w3-center">Sortiraj po:</button>
        <div class="w3-dropdown-content w3-bar-block w3-border" style="right:0">
            <<a href="?sort=Zadanom" class="w3-bar-item w3-button">Zadanom</a>
            <a href="?sort=Kilometrazi" class="w3-bar-item w3-button">Kilometraži</a>
            <a href="?sort=Godistu" class="w3-bar-item w3-button">Godištu</a>
        </div>
    </div>
    <p></p>
    <?php
      $server = "ucka.veleri.hr:3306";
      $database = "adumicic";
      $username = "adumicic";
      $password = "11";
      $conn = mysqli_connect($server, $username, $password, $database);

    ?>
    <div class="w3-center">Popis svih oglasa:
    <div style="display: flex; flex-wrap: wrap; justify-content: space-around; margin: 20px;">
    <?php
    $query = "SELECT * FROM OGLAS INNER JOIN KORISNIK ON ID_korisnika = ID_korisnik";

    if (isset($_GET['sort'])) {
        $sortOption = $_GET['sort'];
    
        switch ($sortOption) {
            case 'Zadanom':
                $query .= " ORDER BY ID_oglasa";
                break;
            case 'Kilometrazi':
                $query .= " ORDER BY km";
                break;
            case 'Godistu':
                $query .= " ORDER BY godiste";
                break;
            // Add more cases if needed
        }
    }               

    $res = mysqli_query($conn, $query);

    while ($row = mysqli_fetch_array($res)) {
        echo "<div class='w3-round-large' style='border: 2px solid #323232; padding: 10px; margin: 10px; width: 60%; position: relative;'>";
        echo "<p style='position: absolute; top: 0; left: 0;'><i>ID: " . $row['ID_oglasa'] . "</i></p>";
        echo "<p style='font-size: larger;'><strong> ".$row['naziv_oglasa'] ."</strong></p>";

        echo "<table class='w3-table-all w3-center' style='width: 100%;'>";
        echo "<tr><td><strong>MARKA</strong></td><td><strong>MODEL</strong></td><td><strong>GODISTE</strong></td><td><strong>KILOMETRI</strong></td></tr>";
        echo "<tr><td>" . $row['marka'] . "</td><td>" . $row['model'] . "</td><td>" . $row['godiste'] . "</td><td>" . $row['km'] . "</td></tr>";
        echo "</table>";

        echo "<p style='border: 1px solid #ddd; padding: 10px; width: 100%;'> " . $row['opis_oglasa'] . "</p>";

        $photoQuery = "SELECT link_foto FROM FOTOGRAFIJE WHERE ID_oglasa = " . $row['ID_oglasa'] ."";
        $photoRes = mysqli_query($conn, $photoQuery);

        $photos = array();

    while ($photoRow = mysqli_fetch_assoc($photoRes)) {
        $imageData = $photoRow['link_foto'];
        if (filter_var($imageData, FILTER_VALIDATE_URL)) {
            $photos[] = $imageData;
        } else {
            $base64Image = base64_encode($imageData);
            $photos[] = 'data:image/jpeg;base64,' . $base64Image;
        }
    }
        if (!empty($photos)) 
        {
        echo "<div class='w3-row-padding'>";
        foreach ($photos as $photo) {
            echo "<div class='w3-col s4 w3-hover-sepia w3-animate-zoom'><img src='$photo' style='width: 300px; height: 300px'></div>";
        }
        echo "</div>";
        }

        echo "<table class='w3-table-all w3-center' style='width: 35%;'>";
        echo "<tr><td><i>" . $row['korisnicko_ime'] . "</i></td><td>" . $row['tel'] . "</td><td><i>" . $row['email'] . "</i></td></tr>";
        echo "</table>";

        echo "</div>";
    }

    mysqli_close($conn);
    ?>
</div>
</div>
</body>
</html>