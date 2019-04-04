var express = require("express");
var router  = express.Router();

const { check, validationResult } = require('express-validator/check');


// making the db connection available IF IN ROUTE FOLDER START PATH WITH DOUBLE DOTS ..
var db = require('../db');

// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');




// INDEX OF BURN PROJECTS 
router.get("/projects", function(req, res){
 
    //read the query file into variable called data
    fs.readFile('queries/burn_project_index.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db return variable results
      db.query(data, function (error, results) {
        if (error) throw error;
        var mSubmit = moment;
        //if no error pass the result and render the burn request.ejs template
        res.render("./projects/index", {burns: results, moment:moment});
      });
    });
});


// NEW BURN PROJECT FORM

router.get("/projects/new", function(req, res){
  //these nested callbacks query the db to fill dropdown options
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
              db.query('SELECT pre_burn_objective_preset_id AS number, name FROM pre_burn_objective_presets', function(error, objectives) {
                if (error) throw error;
                //direct to form template, passing object to populate dropdowns
                res.render("./projects/new", {
                erts: erts, 
                counties: counties, 
                methods:methods, 
                agencies:agencies, 
                objectives:objectives, 
                fuelmods: fuelmods, 
                airsheds:airsheds});
              });
            });
          });
        });  
      });
    });
  });
});



// CREATE NEW BURN PROJECT
// GET DATA FROM NEW BURN PROJECT FORM, POST TO DB, REDIRECT TO BURN PROJECTS
router.post("/projects", function(req, res){
  
  //take any script tags out of text fields for security purposes
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
        
        project_name:   req.body.project_name.param,
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
  // console.log(newProject);
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
          
          // load query to get the id of the just inserted pre_burn
          fs.readFile('queries/last_pre_burn.sql', 'utf8', function(err, data) {  
            if (err) throw err;
            // run that query
            db.query(data, function (error, pre_burnId) {
              if (error) throw error; 
              //insert many-many objectives into   
              var insert3sql = "INSERT INTO pre_burn_objectives (pre_burn_id, pre_burn_objective_preset_id) VALUES ?";
              var values = [];
              //build the array of arrays to insert in many-many objectives table
              req.body.objectives.forEach(function(objectiveId, i){
                //not sure why objectiveId is a string but the regex removes the quotes, ideally
                values.push([pre_burnId[0].pre_burn_id, parseInt(objectiveId) ]);
              });
              console.log(values);
              db.query(insert3sql, [values], function(err, result) {
                if (err) throw err;
                // redirect back to burn project index
                res.redirect("/projects");
                  
              });
            });
          });
        });        
      });
    });
  });
});


// SHOW a specific burn project and it's reviews

router.get("/projects/:id", function(req, res) {
    // Find the burn project with provided ID
    
    //load the generic query to see all burn project details
    
    //This nesting of functions is needed because of the asynchronous node.js
    
    fs.readFile('queries/burn_project_show.sql', 'utf8', function(err, projectquery) {  
      if (err) throw err;
      
      fs.readFile('queries/burn_project_reviews.sql', 'utf8', function(err, reviewquery) {  
        if (err) throw err;
        
        fs.readFile('queries/objectives_show.sql', 'utf8', function(err, objectivequery) {  
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
                
                // query the db for objectives comments and return array objectives
                db.query(objectivequery, req.params.id, function (error, objectives) {
                if (error) throw error;
                  console.log(objectives);
                  console.log(reviews);
                  //if no error pass the burn details, reviews, objectives, and momentjs to the ejs template
                  res.render("./projects/show", {burn: foundBurn, reviews:reviews, moment: moment, objectives:objectives});
                });
              });
            };
          });  
        });
      });
    });
});

//  EDIT a burn project

router.get("/projects/:id/edit", function(req, res) {
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

router.put("/projects/:id", function(req, res){
  
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
        req.body.project_name.param,
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

router.delete("/projects/:id", function(req, res){
  //
  db.query('DELETE FROM burn_projects WHERE burn_project_id=?', req.params.id, function(err, result) {
    if (err) {throw err;} else {
        res.redirect("/projects/");
    };
  });
});

module.exports=router;