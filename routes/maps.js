var express = require("express");
var router = express.Router(),
    expressValidator =  require('express-validator'), //validate user inputs server-side
    expressSanitizer =  require("express-sanitizer"), // sanitize scripts etc. from user input
    middleware =        require('../middleware');     // some functions for user auth, etc.
const {
  check,
  validationResult
} = require('express-validator/check');


// making the db connection available IF IN ROUTE FOLDER START PATH WITH DOUBLE DOTS ..
var db = require('../db');

// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');

//stop nesting sequential functions
var async = require('async');

//
var geoJSON = require('geojson');


//MAP PAGE 1
router.get("/map", function(req, res){
    res.render("./maps/map");
});


//MAP PAGE 3
router.get("/map3", function(req, res){
    res.render("./maps/map3");
});


//MAP PAGE 2
router.get("/map2", function(req, res){
    fs.readFile('queries/maps/all_projects.sql', 'utf8', function(err, data) {
    if (err) throw err;

    // if no error query the db return variable results
        db.query(data, function(error, results) {
          if (error) throw error;
            var mapPoints = geoJSON.parse(results, {Point: ['lat','lng']});
          
            res.render("./maps/map2",{mapPoints:mapPoints

            });
        });
    });
//     console.log('at the maps main route')
//     res.render("./maps/map2");
    
});

//MAP PAGE 2
router.get("/map4", function(req, res){
    fs.readFile('queries/maps/all_projects.sql', 'utf8', function(err, data) {
    if (err) throw err;

    // if no error query the db return variable results
        db.query(data, function(error, results) {
          if (error) throw error;
            var mapPoints = geoJSON.parse(results, {Point: ['lat','lng']});
            //console.log(mapPoints);
			console.log(JSON.stringify(mapPoints));
            res.render("./maps/map4",{mapPoints:mapPoints

            });
        });
    });
//     console.log('at the maps main route')
//     res.render("./maps/map2");
    
});

module.exports = router;