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


// INDEX OF BURN PROJECTS 
router.get("/projects", 
//            middlewareObj.isLoggedIn (), 
// implement page restriction last            
           function(req, res) {

  //read the query file into variable called data
  fs.readFile('queries/projects/index2.sql', 'utf8', function(err, data) {
    if (err) throw err;

    // if no error query the db return variable results
    db.query(data, function(error, results) {
      if (error) throw error;
      var mSubmit = moment;
      //if no error pass the result and render the burn request.ejs template
      res.render("./projects/index", {
        burns: results,
        moment: moment
      });
    });
  });
});


// NEW BURN PROJECT FORM

router.get("/projects/new", function(req, res) {
  //not the prettiest way to chain seven trips to the db but flat and works for now
    const ertQ = new Promise((resolve,reject) =>{
       db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', 
       function(err, erts) { if (err) return reject( err); resolve(erts); });
    });

    const countyQ = new Promise((resolve,reject) =>{
        db.query('SELECT county_id AS number, name FROM counties', 
        function(err, counties) { if (err) return reject( err); resolve(counties); });
    });         

    const methodQ = new Promise((resolve, reject) => {
      db.query('SELECT ignition_method_id AS number, name FROM ignition_methods',
        function(err, methods) { if (err) return reject(err); resolve(methods); });
    });     

    const agencyQ = new Promise((resolve, reject) => {
      db.query('SELECT agency_id AS number, agency AS name, display AS display FROM agencies ORDER BY name DESC',
        function(err, agencies) {          if (err) return reject(err);          resolve(agencies);        });
    });

    const objectiveQ = new Promise((resolve,reject) =>{
        db.query('SELECT pre_burn_objective_preset_id AS number, name FROM pre_burn_objective_presets', 
        function(err, objectives) { if (err) return reject( err); resolve(objectives); });
    });         

    const fuelmodQ = new Promise((resolve, reject) => {
      db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', 
      function(err, fuelmods) {if (err) return reject(err); resolve(fuelmods); });
    });  

    const airshedQ = new Promise((resolve,reject) =>{
        db.query('SELECT airshed_id AS number, name FROM airsheds', 
        function(err, airsheds) {if (err) return reject( err); resolve(airsheds); });
    });         

    Promise.all([ertQ,
                 countyQ,
                 methodQ,
                 agencyQ,
                 objectiveQ,
                 fuelmodQ,
                 airshedQ
                ])
    .then(([erts, counties, methods, agencies, objectives, fuelmods, airsheds]) => {

    res.render("./projects/new", {
        erts: erts,
        counties: counties,
        methods: methods,
        agencies: agencies,
        objectives: objectives,
        fuelmods: fuelmods,
        airsheds: airsheds
      });

    }).catch(err => console.log(err));
});
  
// CREATE NEW BURN PROJECT
// GET DATA FROM NEW BURN PROJECT FORM, VALIDATE, SANITIZE, POST TO DB, REDIRECT TO BURN PROJECTS

router.post("/projects", [
  // server-side form validation
  check('agency_id').not().isEmpty().withMessage('Agency is required'),
  check('airshed_id').not().isEmpty().isInt().withMessage('Airshed is required'),
  check('project_acres').not().isEmpty().isInt().withMessage('Acres should be a number'),
  check('elevation_low').not().isEmpty().isInt().withMessage('Low elevation should be a number'),
  check('elevation_high').not().isEmpty().isInt().withMessage('High elevation should be a number'),
  check('major_fbps_fuel').not().isEmpty().isInt().withMessage('Fuel type 1-13 required'),
  check('first_burn').not().isEmpty().withMessage('First burn date required'),
  check("first_burn").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Date must be in YYYY-MM-DD format'),
  check('duration').not().isEmpty().isInt().withMessage('Duration should be a number'),
  check('ignition_method').not().isEmpty().isInt().withMessage('Ignition method required'),
  check('county_id').not().isEmpty().isInt().withMessage('County required'),
  check('burn_type').not().isEmpty().isInt().withMessage('Burn Type required'),
  check('objectives').not().isEmpty().isInt().withMessage('At least one valid objective required'),
  check('pm_max').not().isEmpty().withMessage('Estimate of total tons PM required'),
], function(req, res) {
  //

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //     console.log(errors);    
    //     console.log(errors.array());
    //res.status(422).json({ errors: errors.array() });
    res.render('./fail', {
      errors: errors.array()
    });
  } else {

    //Sanitize- take any script tags out of text fields for security purposes
    req.body.project_name.param = req.sanitize(req.body.project_name.param);

    //Logic to make boolean checkboxes work and some min/max elevation error handling  
    if (req.body.class_1 === undefined) {req.body.class_1 = 0 };
    if (req.body.non_attainment === undefined) {req.body.non_attainment = 0 };
    if (req.body.de_minimis === undefined) {req.body.de_minimis = 0 };
    if (req.body.elevation_low < 2179) {req.body.elevation_low = 2179 };
    if (req.body.elevation_high > 13528) {req.body.elevation_high = 13528 };
    if (req.body.elevation_high < req.body.elevation_low) { req.body.elevation_high = req.body.elevation_low };
    if (req.body.elevation_low > req.body.elevation_high) {req.body.elevation_low = req.body.elevation_high };

    //use js to create current SQL timestamp for insertion into the db  
    var d = new Date();
    var sqlDate = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
    
    //handle the one-day off weirdness of datepicker
    var offDate = req.body.first_burn;
    var correctedDate = new Date(offDate).toISOString().split('T')[0];
    
    // build an object to insert into burn_projects from form data
    var newProject = {
      //burn_project_id: auto-incremented
      agency_id: req.body.agency_id,
      district_id: 17, //user auth here
      added_by: 55, //user auth here
      added_on: sqlDate,
      updated_by: 17, //placeholder for now
      //updated_on:   CURRENT_TIMESTAMP in mySQL
      submitted_by: 17, //placeholder, may deprecate
      submitted_on: sqlDate,
      project_number: "SMS000", //placeholder, deprecate
      project_name: req.body.project_name,
      airshed_id: req.body.airshed_id,
      class_1: req.body.class_1,
      non_attainment: req.body.non_attainment,
      de_minimis: req.body.de_minimis,
      location: "(38, -110.5)",
      project_acres: req.body.project_acres,
      completion_year: 2100, //deprecate
      black_acres_current: 9999, //deprecate?
      elevation_low: req.body.elevation_low,
      elevation_high: req.body.elevation_high,
      major_fbps_fuel: req.body.major_fbps_fuel,
      first_burn: correctedDate,
      duration: req.body.duration,
      ignition_method: req.body.ignition_method, //deprecate this, should be many-many
      county: req.body.county_id,
      burn_type: req.body.burn_type,
      number_of_piles: 9999, //placeholder - deprecate?
      pm_max: req.body.pm_max,
    };

    //Add new row to burn_projects table
    var insert1 = db.query('INSERT INTO burn_projects SET?', newProject, function(err, result) {
      if (err) throw err;

      // load query to get the id of the just inserted project
      fs.readFile('queries/last_burn_project.sql', 'utf8', function(err, data) {
        if (err) throw err;

        //run that query
        db.query(data, function(error, project_id) {
          if (error) throw error;

          //query to insert many-many objectives into pre_burn_objectives  
          var insert3sql = "INSERT INTO pre_burn_objectives (pre_burn_id, pre_burn_objective_preset_id, burn_project_id) VALUES ?";
          //build the array of arrays to insert into objectives table 
          var objs = [];

          //if just one objective is selected it comes as a string and needs to be handled differently
          if (!Array.isArray(req.body.objectives)) {
            objs.push([9999, req.body.objectives, project_id[0].burn_project_id]);
          } else {
            for (var i = 0; i < req.body.objectives.length; i++) {
              objs.push([9999, parseInt(req.body.objectives[i]), project_id[0].burn_project_id]);
            }
          }
          db.query(insert3sql, [objs], function(err, result) {
            if (err) throw err;
            // redirect back to burn project index
            res.redirect("/projects");

          });
        });
      });
    });
  };
});



// SHOW a specific burn project and it's reviews

router.get("/projects/:id", function(req, res) {
  // Find the burn project with provided ID

  //load the generic query to see all burn project details

  //This nesting of functions is needed because of the asynchronous node.js

  fs.readFile('queries/projects/show.sql', 'utf8', function(err, projectquery) {
    if (err) throw err;
    fs.readFile('queries/projects/reviews.sql', 'utf8', function(err, reviewquery) {
      if (err) throw err;
      fs.readFile('queries/objectives_show.sql', 'utf8', function(err, objectivequery) {
        if (err) throw err;

        // query the db for burn request details and return array foundBurn
        db.query(projectquery, req.params.id, function(error, foundBurn) {
          if (error) throw error;
          if (foundBurn[0] === undefined) {
            const errors = [{
              msg: 'No such burn exists'
            }];
            res.render('./fail', {
              errors: errors
            });
          } else {

            // query the db for reviewer comments and return array reviews
            db.query(reviewquery, req.params.id, function(error, reviews) {
              if (error) throw error;

              // query the db for objectives and return array objectives
              db.query(objectivequery, req.params.id, function(error, objectives) {
                if (error) throw error;
                //if no error pass the burn details, reviews, objectives, and momentjs to the ejs template
                res.render("./projects/show", {
                  burn: foundBurn,
                  reviews: reviews,
                  moment: moment,
                  objectives: objectives
                });
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
    db.query(projectquery, req.params.id, function(error, foundBurn) {

      if (error) throw error;
      if (foundBurn[0] === undefined) {
        const errors = [{
          msg: 'No such burn exists'
        }];
        res.render('./fail', {
          errors: errors
        });
      } else {
        fs.readFile('queries/objectives_show.sql', 'utf8', function(err, objectivequery) {
          if (err) throw err;
          db.query(objectivequery, req.params.id, function(error, burnObjectives) {
            if (error) throw error;
            db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', function(error, erts) {
              if (error) throw error;
              db.query('SELECT county_id AS number, name FROM counties', function(error, counties) {
                if (error) throw error;
                db.query('SELECT ignition_method_id AS number, name FROM ignition_methods', function(error, methods) {
                  if (error) throw error;
                  db.query('SELECT agency_id AS number, agency AS name, display AS display FROM agencies ORDER BY name DESC', function(error, agencies) {
                    if (error) throw error;
                    db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', function(error, fuelmods) {
                      if (error) throw error;
                      db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
                        if (error) throw error;
                        db.query('SELECT name, pre_burn_objective_preset_id AS number FROM pre_burn_objective_presets', function(error, objectives) {
                          if (error) throw error;
                          // handling for SQL date to pass to template so it works in HTML date input type
                          var momentDate = moment(foundBurn[0].first_burn);
                          var truncDate = momentDate.format("YYYY-MM-DD");
                          if (error) throw error;
                          objectives.forEach(function(objective, i){
                            console.log(objective);  
                            if (burnObjectives.some(e => e.number === objective.number)) {
                                console.log('True');
                            } else { console.log('false')}
                          });
                          
                          
                          res.render("./projects/edit", {
                            burn: foundBurn,
                            burnObjectives: burnObjectives,
                            objectives: objectives,
                            erts: erts,
                            counties: counties,
                            methods: methods,
                            agencies: agencies,
                            fuelmods: fuelmods,
                            airsheds: airsheds,
                            date: truncDate
                          });
                        });
                      });
                    });
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

router.put("/projects/:id", [
  // server-side form validation
  check('agency_id').not().isEmpty().withMessage('Agency is required'),
  check('airshed_id').not().isEmpty().withMessage('Airshed is required'),
  check('project_acres').not().isEmpty().isInt().withMessage('Acres should be a number'),
  check('elevation_low').not().isEmpty().isInt().withMessage('Low elevation should be a number'),
  check('elevation_high').not().isEmpty().isInt().withMessage('High elevation should be a number'),
  check('major_fbps_fuel').not().isEmpty().isInt().withMessage('Fuel type 1-13 required'),
  check('first_burn').not().isEmpty().withMessage('First burn date required'),
  check('duration').not().isEmpty().isInt().withMessage('Duration should be a number'),
  check('ignition_method').not().isEmpty().isInt().withMessage('Ignition method required'),
  check('county_id').not().isEmpty().isInt().withMessage('County required'),
  check('burn_type').not().isEmpty().isInt().withMessage('Burn Type required'),
], function(req, res) {
  //

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    //res.status(422).json({ errors: errors.array() });
    res.render('./fail', {
      errors: errors.array()
    });
  } else {

    //take any script tags out of text fields
    req.body.project_name = req.sanitize(req.body.project_name);

    //Logic to make boolean checkboxes work  
    if (req.body.de_minimis === undefined) {
      req.body.de_minimis = 0
    };
    if (req.body.non_attainment === undefined) {
      req.body.non_attainment = 0
    };
    if (req.body.class_1 === undefined) {
      req.body.class_1 = 0
    };
    if (req.body.de_minimis === 'on') {
      req.body.de_minimis = 1
    };
    if (req.body.non_attainment === 'on') {
      req.body.non_attainment = 1
    };
    if (req.body.class_1 === 'on') {
      req.body.class_1 = 1
    };

    //use native js to create a mySQL date for insertion into the db  
    var d = new Date();
    var sqlDate = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];

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
        if (err) {
          throw err;
        } else {
          res.redirect("/projects/" + req.params.id);
        }
      });

    });
  }
});

// DELETE BURN PROJECT

router.delete("/projects/:id", function(req, res) {
  //
  db.query('DELETE FROM burn_projects WHERE burn_project_id=?', req.params.id, function(err, result) {
    if (err) {
      throw err;
    } else {
      res.redirect("/projects/");
    };
  });
});


module.exports = router;