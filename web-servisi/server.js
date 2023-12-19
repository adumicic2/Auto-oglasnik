var express = require('express');
var app = express();

//const dbConfig = require("./db.config.js");
var mysql = require('mysql');

var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// connection configurations
var dbConn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pzi"
    });

// connect to database
dbConn.connect(); 

app.get("/podaci",function(request,response){
    return response.send({message:" ok"});
})

app.get("/podaci/:id",function(request,response){
    var id=request.params.id;
    id++;  
    return response.send({message:id+" ok"});
})

app.post("/podaci",function(request,response){
    
    var podaci=request.body.podatak;
    return response.send({message:podaci+" ok"});
})
///////////////////////////
app.post("/korisnik",function(request,response){
    
    var ime=request.body.imep;
    var prezime=request.body.prezimep;  
    var tel=request.body.telp

    //return response.send({message:"CREATE  "+ime+" "+prezime});
    dbConn.query(`INSERT INTO korisnik(id,ime,prezime,tel) VALUES(NULL,?,?,?)`,[ime,prezime,tel], function
    (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results[0], message:'Unos novog korisnika '+ime+' '+prezime+' '+tel});
    });

})

app.put("/korisnik/:id",function(request,response){
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


app.get("/korisnik",function(request,response){
    

    dbConn.query('SELECT * FROM korisnik', function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'READ svi korisnici.' });

        //return response.send({message:"READ korisnici"});
})
})

app.get("/korisnik/:id",function(request,response){
    //var id=request.params.id;
    //return response.send({message:id+"READ korisnik "+id});

    ////let-var (isto)
    let useful_part_id = request.params.id;
if (!useful_part_id) {
return response.status(400).send({ error: true, message: 'Please provideuseful_part_id' });
}
dbConn.query('SELECT * FROM korisnik WHERE id=?', useful_part_id, function
(error, results, fields) {
if (error) throw error;
return response.send({ error: false, data: results[0], message:'READ korisnici sa ID-om '+useful_part_id});
});

})

// set port




































app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
