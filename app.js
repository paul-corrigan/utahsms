//express is the node js framework that serves items
var express = require('express');

//body parser allows express to handle user input data from a post request
var bodyParser = require("body-parser");

var app = express();

//framework to interface with mysql
var mysql = require('mysql');

//easy way to verify queries, print the table to the console
var cTable = require('console.table');

// connect to the database.  in c9 also need to start the sql server by
// typing mysql-ctl start in the command line of the console.  
var db = mysql.createConnection({
  host : 'localhost',
  user : 'pcorrigan',
  database: 'utahsms'
});

// fs is the native node API for interacting with a file system
var fs = require('fs');


//connect additional directories to serve css stylesheets etc.
app.use(express.static("public"));

//need to activate bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//tell express to assume .ejs extension to render route template files
app.set("view engine", "ejs");

// HOME
// the root route
app.get("/", function(req, res){

    res.render("home");

});

// REGISTERED BURN LIST
app.get("/burns", function(req, res){
 
    //read the query file 
    fs.readFile('queries/burn_list.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db
      db.query(data, function (error, results) {
        if (error) throw error;
        
        //if no error pass the result and render the burn request.ejs template
        res.render("burns", {burns: results});
      });
    });
});


// REQUEST LIST
app.get("/requests", function(req, res){
 
    //read the query file 
    fs.readFile('queries/burn_request_list.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db
      db.query(data, function (error, results) {
        if (error) throw error;
        
        //if no error pass the result and render the burn request.ejs template
        res.render("requests", {requests: results});
      });
    });
});

// REQUEST CREATE

// burn request form route (create only at the moment)
app.get("/request_form", function(req, res){

//directs to the new request form
    res.render("request_form");
});

//posts a submitted burn request form to the db
app.post("/requests", function(req, res){
  var newReq = {
        
        request_acres:  req.body.size,
        start_date:     req.body.start_date,
        end_date:       req.body.end_date,
        submitted_on:   Date.now(),
    };
    
    var end_result = db.query('INSERT INTO requests SET?', newReq, function(err, result) {
    if (err) throw err;
    res.redirect("/requests");
  });
});









//lets you know the server is running
app.listen(8080, function () {
  console.log('App listening on port 8080!');
});
