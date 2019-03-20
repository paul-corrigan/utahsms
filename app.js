//express is the node js framework that serves items
var express = require('express');

//body parser allows express to handle user input data from a post request
var bodyParser = require("body-parser");

var app = express();

//node framework to interface with mysql
var mysql = require('mysql');

//easy way to verify query results, print the table to the console
var cTable = require('console.table');

// connect to the database.  in c9 also need to start the sql server by
// typing mysql-ctl start in the command line of the console.
var db = mysql.createConnection({
  host : 'localhost',
  user : 'utahsms',
  password : 'utahsms',
  database: 'utahsms'
});

// fs is the native node API for interacting with a file system
// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');

//connect additional directories to serve css stylesheets etc.
app.use(express.static("public"));

//need to activate bodyparser
app.use(bodyParser.urlencoded({extended: true}));

// add the bootstrap script
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));

// add jquery
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));

// add mapboxgl
app.use('/mapbox-gl', express.static(__dirname + '/node_modules/mapbox-gl/dist/'))

//tell express to assume .ejs extension to render route template files
app.set("view engine", "ejs");

// HOME PAGE

app.get("/", function(req, res){

    res.render("home");

});

// INDEX OF REGISTERED BURNS
app.get("/burn_projects", function(req, res){

    //read the query file into variable called data
    fs.readFile('queries/burn_project_list.sql', 'utf8', function(err, data) {
      if (err) throw err;

      // if no error query the db return variable results
      db.query(data, function (error, results) {
        if (error) throw error;

        //if no error pass the result and render the burn request.ejs template
        res.render("burn_projects", {burns: results});
      });
    });
});


// NEW BURN PROJECT FORM

// burn form route (create only at the moment)
app.get("/burn_projects/new", function(req, res){

//directs to the new request form
    res.render("burn_project_form");
});



// CREATE NEW BURN PROJECT
// GET DATA FROM NEW BURN PROJECT FORM, POST TO DB, REDIRECT TO BURN PROJECTS
app.post("/burn_projects", function(req, res){

  //right now can't get the moment.js library to work, the following two lines
  //use native js to create a mySQL date for insertion into the db
  var d = new Date();
  var localDate = d.toISOString().split('T')[0]+' '+d.toTimeString().split(' ')[0];

  var newReq = {

        project_number: req.body.project_number,
        project_name:   req.body.project_name,
        project_acres:  req.body.project_acres,
        // de_minimis:     req.body.de_minimis,
        // major_fbps_fuel:req.body.fuel,
        // ignition_method:req.body.ignition_method,
        first_burn:     req.body.first_burn,
        duration:       req.body.duration,
        submitted_on:   localDate
    };

    var end_result = db.query('INSERT INTO burn_projects SET?', newReq, function(err, result) {
    if (err) throw err;

    //redirect back to burn project page
    res.redirect("/burn_projects");
  });
});

// SHOW a specific burn project
app.get("/burn_projects/:id", function(req, res) {
    // Find the burn project with provided ID
    //read the query file into variable called data
    fs.readFile('queries/burn_project_details.sql', 'utf8', function(err, base) {
      if (err) throw err;

      var query = base.concat(req.params.id);

    // query the db return variable results
      db.query(query, function (error, foundBurn) {
        if (error) throw error;

        //if no error pass the result and render the burn request details.ejs template
        res.render("burn_project_details", {burn: foundBurn})
      });
    });
})






// INDEX BURN REQUESTS

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

// CREATE A NEW REQUEST

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
        submitted_on:   Date.now()
    };

    var end_result = db.query('INSERT INTO burns SET?', newReq, function(err, result) {
    if (err) throw err;
    res.redirect("/requests");
  });
});

app.get("/map", function(req, res){

//directs to the new request form
    res.render("map");
});









//lets you know the server is running
app.listen(8080, function () {
  console.log('App listening on port 8080!');
});
