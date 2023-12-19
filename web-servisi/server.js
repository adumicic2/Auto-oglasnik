var express = require('express');
var app = express();

var mysql = require('mysql');

var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var dbConn = mysql.createConnection({
    host: "ucka.veleri.hr",
    port:3306,
    user: "adumicic",
    password: "11",
    database: "adumicic"
    });

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

app.post("/FOTOGRAFIJE/",function(request,response){
    
    var idf = request.body.idf;
    var link = request.body.link;

    dbConn.query(`INSERT INTO FOTOGRAFIJE(ID_oglasa,ID_fotografije,link_foto) VALUES(NULL,?,?)`,[idf, link], function
    (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results[0], message:'Unos FOTKE '+link});
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


app.get("/FOTOGRAFIJE/",function(request,response){
    

    dbConn.query('SELECT * FROM FOTOGRAFIJE', function (error, results, fields) {
        if (error) throw error;
        return response.send({ error: false, data: results, message: 'READ sve fotografije.' });

        //return response.send({message:"READ korisnici"});
})
})

app.get("/FOTOGRAFIJE/:id",function(request,response){
    //var id=request.params.id;
    //return response.send({message:id+"READ korisnik "+id});

    ////let-var (isto)
    let useful_part_id = request.params.id;
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
