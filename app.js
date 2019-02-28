//express is the node js framework that serves items
var express = require('express');

//body parser allows express to handle user input data from a post request
var bodyParser = require("body-parser");

var app = express();

// sanitize scripts etc. from user input
var expressSanitizer = require("express-sanitizer");

//node framework to interface with mysql
var mysql = require('mysql');

//easy way to verify query results, print the table to the console
var cTable = require('console.table');

// db credentials etc in config file .env which is .gitignored
require('dotenv').config();


// connect to the database.  in c9 also need to start the sql server by
// typing mysql-ctl start in the command line of the console.  
var db = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  database: process.env.DB_NAME
});

// fs is a node package for interacting with a file system
// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');

//method-override allows put and delete request HTTP routing, not supported by HTML
var methodOverride = require('method-override');

//modularize routes to clean up the app.js
var projectRoutes = require('./routes/projects'),
    requestRoutes = require('./routes/requests'),
    userRoutes    = require('./routes/users'),
    reportRoutes  = require('./routes/reports');

//tell express to assume .ejs extension to render route template files
app.set("view engine", "ejs");

//connect additional directories to serve css stylesheets etc.
app.use(express.static("public"));

//need to activate bodyparser
app.use(bodyParser.urlencoded({extended: true}));

//express-sanitizer goes after bodyparser
app.use(expressSanitizer());

//tells the app to look for type HTTP request appended after _method
app.use(methodOverride("_method"));

// HOME PAGE

app.get("/", function(req, res){

    res.render("home");

});

// INDEX OF BURN PROJECTS 
app.get("/projects", function(req, res){
 
    //read the query file into variable called data
    fs.readFile('queries/burn_project_index.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db return variable results
      db.query(data, function (error, results) {
        if (error) throw error;
        var mSubmit = moment
        //if no error pass the result and render the burn request.ejs template
        res.render("./projects/index.ejs", {burns: results, moment:moment});
      });
    });
});


// NEW BURN PROJECT FORM

// burn form route (create only at the moment)
app.get("/projects/new", function(req, res){
  //these nested callbacks load various numbers and names to fill dropdowns
  db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', function (error, erts) {
    if (error) throw error;
    db.query('SELECT county_id AS number, name FROM counties', function (error, counties) {
      if (error) throw error;
      db.query('SELECT ignition_method_id AS number, name FROM ignition_methods', function(error, methods) {
        if (error) throw error;
        db.query('SELECT agency_id AS number, agency AS name FROM agencies ORDER BY name DESC', function(error, agencies) {
          if (error) throw error;
          db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', function(error, fuelmods) {
            if (error) throw error;
            db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
              if (error) throw error;
              res.render("./projects/new", {erts: erts, counties: counties, methods:methods, agencies:agencies, fuelmods: fuelmods, airsheds:airsheds});
            });
          });
        });  
      });
    });
  });
});



// CREATE NEW BURN PROJECT
// GET DATA FROM NEW BURN PROJECT FORM, POST TO DB, REDIRECT TO BURN PROJECTS
app.post("/projects", function(req, res){
  
  //take any script tags out of text fields
  req.body.project_name = req.sanitize(req.body.project_name);
  
  //Logic to make boolean checkboxes work  
  if (req.body.de_minimis     === undefined) {req.body.de_minimis = 0};
  if (req.body.non_attainment === undefined) {req.body.non_attainment  = 0};
  if (req.body.class_1        === undefined) {req.body.class_1  = 0};
  
  //use js to create current SQL timestamp for insertion into the db  
  var d = new Date();
  var sqlDate = d.toISOString().split('T')[0]+' '+d.toTimeString().split(' ')[0];
  
  // build an object to insert into burn_projects from form data
  var newProject = {
        
        project_name:   req.body.project_name,
        submitted_by:   55, //user auth here
        project_acres:  req.body.project_acres,
        submitted_on:   sqlDate,
        agency_id:      req.body.agency_id,
        elevation_low:  req.body.elevation_low,
        elevation_high: req.body.elevation_high,
        airshed_id:     req.body.airshed_id,
        class_1:        req.body.class_1,
        non_attainment: req.body.non_attainment,
        de_minimis:     req.body.de_minimis,
        duration:       req.body.duration,
        first_burn:     req.body.first_burn,
        burn_type:      req.body.burn_type,
        ignition_method:req.body.ignition_method,
        major_fbps_fuel:req.body.major_fbps_fuel,
        county:         req.body.county_id
        
    };
  
  var insert1 = db.query('INSERT INTO burn_projects SET?', newProject, function(err, result) {
    if (err) throw err;
    
    // load query to get the id of the just inserted project
    fs.readFile('queries/last_burn_project.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      //run that query
      db.query(data, function (error, results) {
        if (error) throw error; 
        
        // build an object to insert into pre_burns from form data
        var newPreburn = {
          burn_project_id:results[0].burn_project_id,
          agency_id:      req.body.agency_id,
          submitted_by:   55,
          submitted_on:   sqlDate,
          acres:          req.body.project_acres,
          pm_max:         req.body.pm_max
        };
        
        var insert2 = db.query('INSERT INTO pre_burns SET?', newPreburn, function(err, result) {
          if (err) throw err;
          
          // redirect back to burn project index
          res.redirect("/projects");
        });        
      });
    });
  });
});

// SHOW a specific burn project and it's reviews
app.get("/projects/:id", function(req, res) {
    // Find the burn project with provided ID
    
    //load the generic query to see all burn project details
    
    //This nesting of functions is needed because of the asynchronous node.js
    
    fs.readFile('queries/burn_project_show.sql', 'utf8', function(err, projectquery) {  
      if (err) throw err;
      
      fs.readFile('queries/burn_project_reviews.sql', 'utf8', function(err, reviewquery) {  
        if (err) throw err;
        
        // query the db for burn request details and return array foundBurn
        db.query(projectquery, req.params.id, function (error, foundBurn) {
          if (error) throw error;
          if (foundBurn[0] === undefined) {
            console.log('No such burn exists');
            res.redirect("/projects");
          } else {
     
            // query the db for reviewer comments and return array reviews
            db.query(reviewquery, req.params.id, function (error, reviews) {
              if (error) throw error;
              
              
              //if no error pass the burn details, reviews, and momentjs to the ejs template
              res.render("./projects/show", {burn: foundBurn, reviews:reviews, moment: moment});
            });
          };  
        });
      });
    });
});

//  EDIT a burn project
app.get("/projects/:id/edit", function(req, res) {
  fs.readFile('queries/burn_project_show.sql', 'utf8', function(err, projectquery) {  
    if (err) throw err;
    // query the db for burn request details and return array foundBurn
    db.query(projectquery, req.params.id, function (error, foundBurn) {
      
      if (error) throw error;
      if (foundBurn[0] === undefined) {
        console.log('No such burn exists');
        res.redirect("/projects");
      } else {
        db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', function (error, erts) {
          if (error) throw error;
          db.query('SELECT county_id AS number, name FROM counties', function (error, counties) {
            if (error) throw error;
            db.query('SELECT ignition_method_id AS number, name FROM ignition_methods', function(error, methods) {
              if (error) throw error;
              db.query('SELECT agency_id AS number, agency AS name FROM agencies ORDER BY name DESC', function(error, agencies) {
                if (error) throw error;
                db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', function(error, fuelmods) {
                  if (error) throw error;
                  db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
                    // handling for SQL date to pass to template so it works in HTML date input type
                    var momentDate = moment(foundBurn[0].first_burn);
                    var truncDate = momentDate.format("YYYY-MM-DD");
                    if (error) throw error;
                    res.render("./projects/edit", {burn:foundBurn, erts: erts, counties: counties, methods:methods, agencies:agencies, fuelmods: fuelmods, airsheds:airsheds, date:truncDate});
                  });
                });
              });
            });
          });
        });
      };
    });
  });  
});

// UPDATE BURN PROJECT
app.put("/projects/:id", function(req, res){
  
  //take any script tags out of text fields
  req.body.project_name = req.sanitize(req.body.project_name);
  
  //Logic to make boolean checkboxes work  
  if (req.body.de_minimis     === undefined) {req.body.de_minimis = 0};
  if (req.body.non_attainment === undefined) {req.body.non_attainment  = 0};
  if (req.body.class_1        === undefined) {req.body.class_1  = 0};
  if (req.body.de_minimis     === 'on') {req.body.de_minimis = 1};
  if (req.body.non_attainment === 'on') {req.body.non_attainment  = 1};
  if (req.body.class_1        === 'on') {req.body.class_1  = 1};
  
  //use native js to create a mySQL date for insertion into the db  
  var d = new Date();
  var sqlDate = d.toISOString().split('T')[0]+' '+d.toTimeString().split(' ')[0];
  
  // build an ARRAY to UPDATE burn_projects from form data
  // Couldn't figure out how to use an object due to the 
  // need to incorporate req.params.id in the WHERE clause
  var updateArray = [
        req.body.project_acres,
        req.body.project_name,
        req.body.elevation_high,
        req.body.elevation_low,
        req.body.duration,
        req.body.agency_id,
        // //implement user auth here
        req.body.airshed_id,
        req.body.class_1,
        req.body.non_attainment,
        req.body.de_minimis,
        req.body.major_fbps_fuel,
        req.body.first_burn,
        req.body.ignition_method,
        req.body.county_id,
        req.body.burn_type,
        sqlDate,
        req.params.id
        ];
  fs.readFile('queries/burn_project_update.sql', 'utf8', function(err, updateQuery) {  
      if (err) throw err;
      db.query(updateQuery, updateArray, function(err, result) {
        if (err) {throw err;} else {
          res.redirect("/projects/" + req.params.id);
        }
      });
    
  });
});

// DELETE BURN PROJECT
app.delete("/projects/:id", function(req, res){
  //
  db.query('DELETE FROM burn_projects WHERE burn_project_id=?', req.params.id, function(err, result) {
    if (err) {throw err;} else {
        res.redirect("/projects/");
    };
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


