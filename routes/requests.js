var express = require("express");
var router  = express.Router(),
    expressValidator= require('express-validator'), //validate user inputs server-side
    expressSanitizer = require("express-sanitizer"); // sanitize scripts etc. from user input
const { check, validationResult } = require('express-validator/check');

// making the db connection available IF IN ROUTE FOLDER START PATH WITH DOUBLE DOTS ..
var db = require('../db');

// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');


// INDEX BURN REQUESTS

router.get("/requests", function(req, res){
 
    //read the query file 
    fs.readFile('queries/request_index.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db
      db.query(data, function (error, results) {
        if (error) throw error;
        
        //if no error pass the result and render the burn request.ejs template
        res.render("./requests/index", {requests: results});
      });
    });
});

// NEW REQUEST

// burn request form route (create only at the moment)
router.get("/requests/new", function(req, res){
      
      db.query('SELECT burn_project_id AS number, project_name AS name, agency_id AS agency, district_id AS district FROM burn_projects ORDER BY name', function (error, projects) {
        if (error) throw error;
        //directs to the new request form
        res.render("./requests/new", {projects:projects});
      });
});

// CREATE posts a submitted burn request form to the db
router.post("/requests", [
  // server-side form validation
  check('size').not().isEmpty().withMessage('Request acres is required'),
  check("start_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Date must be in MM-DD-YYYY format'),
  check("end_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Date must be in MM-DD-YYYY format'),
  check('burn_project').not().isEmpty().isInt().withMessage('Must Select a Burn Project'),
  ], function(req, res){
  //
  
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
        
       res.render('./fail', {errors: errors.array()});  
    } else {
      
      console.log(req.body.burn_project);
      //use js to create current SQL timestamp for insertion into the db  
      var d = new Date();
      var sqlDate = Date().toISOString().split('T')[0]+' '+d.toTimeString().split(' ')[0];
      var newReq = {

            //burn_project_id:req.body.burn_id,
            burn_project_id:req.body.burn_project,
            request_acres:  req.body.size,
            start_date:     req.body.start_date,
            end_date:       req.body.end_date,
            submitted_on:   sqlDate
        };

        var end_result = db.query('INSERT INTO burns SET?', newReq, function(err, result) {
          if (err) throw err;
          res.redirect("/requests");
        });
    }
});



module.exports=router;