var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser=require('body-parser');
const multer = require('multer');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
const cors = require('cors');
app.use(cors());
const util = require('util');
const jwt = require('jsonwebtoken');
var dbConn = mysql.createConnection({
    host: "ucka.veleri.hr",
    port:3306,
    user: "adumicic",
    password: "11",
    database: "adumicic"
    });

dbConn.connect(); 

const dbQueryAsync = util.promisify(dbConn.query.bind(dbConn));

const upload = multer({ storage: multer.memoryStorage() });

app.post('/checkusername/',async function(request,response){
    
    try {
        let korisnicko_ime = request.body.korisnicko_ime;
        const results = await dbQueryAsync('SELECT COUNT(*) AS count FROM KORISNIK WHERE korisnicko_ime = ?', [korisnicko_ime]);
        const postojiKorisnik = results[0].count > 0;
        response.json({ postojiKorisnik });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, message: 'Internal server error' });
    }
});

app.post('/checkLogin/',async function(request,response){
    
    try {
        let korisnicko_ime = request.body.korisnicko_ime;
        var sifra = request.body.sifra;
        const results = await dbQueryAsync('SELECT ID_korisnika FROM KORISNIK WHERE korisnicko_ime = ? AND lozinka= ?', [korisnicko_ime, sifra]);
        if (results.length > 0) {
            const ID_korisnika = results[0].ID_korisnika;
            logiraniKorisnikId = ID_korisnika;
            response.json({ logiran: true, ID_korisnika });
        } else {
            response.json({ logiran: false });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, message: 'Internal server error' });
    }
});

app.post("/KORISNIK/", async function(request,response){
    
    try {
        var username = request.body.username;
        var email = request.body.email;
        var telefon = request.body.telefon;
        var sifra = request.body.sifra;

        const results = await dbQueryAsync('INSERT INTO KORISNIK(ID_korisnika, korisnicko_ime, lozinka, tel, email) VALUES (NULL,?,?,?,?)',
         [username, sifra, telefon, email]);

         logiraniKorisnikId = results.insertId;

    } catch (error) {
        console.error(error);
        response.status(500).json({ error: true, message: 'Internal server error' });
    }
});

app.post("/posaljioglas/", async function(request,response){
    
    try {

        var ID_korisnik = request.body.ID_korisnik;
        var naziv_oglasa = request.body.naziv_oglasa;
        var marka = request.body.marka;
        var model = request.body.model;
        var godiste = request.body.godiste;
        var km = request.body.km;
        var opis_oglasa = request.body.opis_oglasa;
        const results = await dbQueryAsync('INSERT INTO OGLAS(ID_oglasa, ID_korisnik, naziv_oglasa, marka, model, godiste, km, opis_oglasa) VALUES (NULL,?,?,?,?,?,?,?)',
        [ID_korisnik, naziv_oglasa, marka, model, godiste, km, opis_oglasa]);

        } catch (error) {
            console.error(error);
            response.status(500).json({ error: true, message: 'Internal server error app post oglas' });
        }
});

app.post("/FOTOGRAFIJE/", upload.single('file'), async function(request, response) {
    if (!request.file) {
        return response.status(400).send('Nije uploadana slika!');
    }

    const link_foto = request.file.buffer;

    const lastInsertResult = await dbQueryAsync('SELECT LAST_INSERT_ID() as lastInsertId');
    var zadnjiID = lastInsertResult[0].lastInsertId;

    console.log("LAST ID: " + zadnjiID);

    dbConn.query(
        'INSERT INTO FOTOGRAFIJE(ID_oglasa, link_foto) VALUES (?, ?)',
        [zadnjiID, link_foto],
        function (error, results, fields) {
            if (error) {
                console.error('Database error:', error);
                return response.status(500).send('Internal Server Error app post fotke');
            } else {
                return response.send({ error: false, data: link_foto, message: 'Slika je poslana' });
            }
        }
    );
});

app.put("/updateBroj/:idkors", function(request,response){

    let idkors = request.params.idkors;
    let noviBroj = request.body.noviBroj;
    if (noviBroj === null || noviBroj === undefined){
        return response.status(400).send({ error: true, message: 'Nevažeći broj telefona' });
    }
    
    dbConn.query('UPDATE KORISNIK SET tel = ? WHERE ID_korisnika = ?', [noviBroj, idkors], function
    (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results[0], message:'Izmjena broja telefona korisnika s ID-om '+idkors});
    });
})
app.delete("/brisiOglase/:korisnik_ID", function (request, response) {
    let korisnik_ID = request.params.korisnik_ID;

    if (!korisnik_ID) {
        return response.status(400).json({ error: true, message: 'Nepostojeći ID' });
    }

    dbConn.query('DELETE FROM OGLAS WHERE ID_korisnik=?', korisnik_ID, function (error, results, fields) {
        if (error) {
            return response.status(500).json({ error: true, message: 'Greška prilikom brisanja oglasa', errorDetails: error });
        }

        const affectedRows = results.affectedRows;

        if (affectedRows > 0) {
            return response.json({ error: false, data: { affectedRows }, message: `Brisanje ${affectedRows} oglasa korisnika: ${korisnik_ID}` });
        } else {
            return response.status(404).json({ error: true, message: 'Nema oglasa za brisanje za korisnika: ' + korisnik_ID });
        }
    });
});


app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
