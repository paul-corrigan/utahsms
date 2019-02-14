//express is the node js framework that serves items
var express = require('express');

//body parser allows express to handle user input data from a post request
var bodyParser = require("body-parser");

var app = express();

//node framework to interface with mysql
var mysql = require('mysql');

//easy way to verify query results, print the table to the console
var cTable = require('console.table');

// should move db credentials to a .env and include .env in a .gitignore
require('dotenv').config();


// connect to the database.  in c9 also need to start the sql server by
// typing mysql-ctl start in the command line of the console.  
var db = mysql.createConnection({
  host : 'localhost',
  user : 'pcorrigan',
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
        
        project_name:   req.body.project_name,
        project_acres:  req.body.project_acres,
        agency_id:      req.body.agency_id,
        submitted_by:   req.body.submitted_by,
        submitted_on:   localDate,
        county:         req.body.county_id,
        elevation_low:  req.body.elevation_low,
        elevation_high: req.body.elevation_high,
        duration:       req.body.duration,
        major_fbps_fuel:req.body.major_fbps_fuel,
    };
    
    var end_result = db.query('INSERT INTO burn_projects SET?', newReq, function(err, result) {
    if (err) throw err;
    
    //redirect back to burn project page
    res.redirect("/burn_projects");
  });
});

// SHOW a specific burn project and it's reviews
app.get("/burn_projects/:id", function(req, res) {
    // Find the burn project with provided ID
    
    //load the generic query to see all burn project details
    
    //This nesting of functions is needed because of the asynchronous node.js
    
    fs.readFile('queries/burn_project_details.sql', 'utf8', function(err, projectquery) {  
      if (err) throw err;
      
      fs.readFile('queries/burn_project_reviews.sql', 'utf8', function(err, reviewquery) {  
        if (err) throw err;
        
        // query the db for burn request details and return array foundBurn
        db.query(projectquery, req.params.id, function (error, foundBurn) {
          if (error) throw error;
     
          // query the db for reviewer comments and return array reviews
          db.query(reviewquery, req.params.id, function (error, reviews) {
            if (error) throw error;
            
            
            //if no error pass the result and render the burn request details.ejs template
            res.render("burn_project_details", {burn: foundBurn, reviews:reviews});
          });
            
        });
      });
    });
});






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









//lets you know the server is running
app.listen(8080, function () {
  console.log('App listening on port 8080!');
});
