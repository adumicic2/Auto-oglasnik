var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser=require('body-parser');
const multer = require('multer');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
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

var logiraniKorisnikId = 0;

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
        var ID_korisnik = 1; // zadana vrijednost
        if (logiraniKorisnikId != 0)
        {
            ID_korisnik = logiraniKorisnikId;
        }
        else if (request.body.ID_korisnik) {
            ID_korisnik = request.body.ID_korisnik;
        }
        var naziv_oglasa = request.body.naziv_oglasa;
        var marka = request.body.marka;
        var model = request.body.model;
        var godiste = request.body.godiste;
        var km = request.body.km;
        var opis_oglasa = request.body.opis_oglasa;
        const results = await dbQueryAsync('INSERT INTO OGLAS(ID_oglasa, ID_korisnik, naziv_oglasa, marka, model, godiste, km, opis_oglasa) VALUES (NULL,?,?,?,?,?,?,?)',
        [ID_korisnik, naziv_oglasa, marka, model, godiste, km, opis_oglasa]);

        const zadnjiId = results.insertId;

        app.post("/FOTOGRAFIJE/", upload.array('file', 5),function(request,response){
    
            var ID_oglasa = zadnjiId;
        
            if (!request.files || request.files.length === 0)
            {
                return response.status(400).send('Nisu uploadane slike!');
            }
        
            const link_fotoArray = request.files.map(file =>{
                return file.buffer;
            });
        
            const insertPromises = link_fotoArray.map(link_foto => {
                return new Promise((resolve, reject) => {
                    dbConn.query(
                        'INSERT INTO FOTOGRAFIJE(ID_oglasa, link_foto) VALUES (?, ?)',
                        [ID_oglasa, link_foto],
                        function (error, results, fields) {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        }
                    );
                });
            });
            Promise.all(insertPromises)
            .then(results => {
                return response.send({ error: false, data: link_fotoArray, message: 'Slike su poslane' });
            })
            .catch(error => {
                console.error('Database error:', error);
                return response.status(500).send('Internal Server Error app post fotke');
            });
        });

        } catch (error) {
            console.error(error);
            response.status(500).json({ error: true, message: 'Internal server error app post oglas' });
        }
});

app.put("/korisnik/:id", function(request,response){
    var ime=request.body.imep;
    var prezime=request.body.prezimep;  
    var tel=request.body.telp
    let useful_part_id = request.params.id;
    //return response.send({message:"UPDATE "+id+" nova adresa: "+adresa});
    
    dbConn.query('UPDATE korisnik SET ime=?,prezime=?, tel=? WHERE id=?', [ime,prezime,tel,useful_part_id], function
    (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results[0], message:'Izmjena korisnika s ID-om '+useful_part_id});
    });
})
app.delete("/korisnik/:id",function(request,response){
    //var id=request.params.id;
    //return response.send({message:"DELETE " +id});
    let useful_part_id = request.params.id;
    if (!useful_part_id) {
    return response.status(400).send({ error: true, message: 'Nepostojeći ID' });
    }

    dbConn.query('DELETE FROM korisnik WHERE id=?', useful_part_id, function
    (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results[0], message:'Brisanje korisnici sa ID-om '+useful_part_id});
    });
}) 


app.get("/FOTOGRAFIJE/",function(request,response){
    dbConn.query('SELECT * FROM FOTOGRAFIJE', function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'READ sve fotografije.' });

})
})



app.get("/FOTOGRAFIJE/:id",function(request,response){
    //var id=request.params.id;
    //return response.send({message:id+"READ korisnik "+id});

    ////let-var (isto)
    let useful_part_id = req.params.id;
if (!useful_part_id) {
return response.status(400).send({ error: true, message: 'Please provideuseful_part_id' });
}
dbConn.query('SELECT * FROM FOTOGRAFIJE WHERE ID_oglasa=?', useful_part_id, function
(error, results, fields) {
if (error) throw error;
return response.send({ error: false, data: results[0], message:'READ fotke sa ID-om oglasa '+useful_part_id});
});

})

app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
