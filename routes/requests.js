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
    fs.readFile('queries/requests/index.sql', 'utf8', function(err, data) {  
      if (err) throw err;
      
      // if no error query the db
      db.query(data, function (error, results) {
        if (error) throw error;
        
        //if no error pass the result and render the burn request.ejs template
        res.render("./requests/index", {requests: results, moment: moment});
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
  check("start_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Date must be in YYYY-MM-DD format'),
  check("end_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Date must be in YYYY-MM-DD format'),
  check('burn_project').not().isEmpty().isInt().withMessage('Must Select a Burn Project'),
  ], function(req, res){
  //
  
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
        
       res.render('./fail', {errors: errors.array()});  
    } else {
      
//       console.log(req.body.burn_project);
      //use js to create current SQL timestamp for insertion into the db  
      var d = new Date();
      var sqlDate = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];
      console.log(req.body.start_date);
      var newReq = {
            //burn_project_id:req.body.burn_id,
            burn_project_id:req.body.burn_project,
            request_acres:  req.body.size,
            start_date:     req.body.start_date,
            end_date:       req.body.end_date,
            submitted_by:   17,
            added_by:       17,
            updated_by:     17,
            added_on:       sqlDate,    
            updated_on:     sqlDate,    
            submitted_on:   sqlDate,
            status_id:      2 // 1 draft, 2 under review, 3 revision requested, 4 pending approval, 5 approved, 6 disapproved
        };

        var end_result = db.query('INSERT INTO burns SET?', newReq, function(err, result) {
          if (err) throw err;
          res.redirect("/requests");
        });
    }
});

// SHOW details about selected burn request
router.get("/requests/:id", function(req, res) {
  // Find the burn request with provided ID

  //load the generic query to see all burn request details

  //This nesting of functions is needed because of the asynchronous node.js

  fs.readFile('queries/requests/show.sql', 'utf8', function(err, requestquery) {
    if (err) throw err;
    fs.readFile('queries/requests/reviews.sql', 'utf8', function(err, reviewquery) {
      if (err) throw err;
      

        // query the db for burn request details and return array foundRequest
        db.query(requestquery, req.params.id, function(error, foundRequest) {
          if (error) throw error;
          if (foundRequest[0] === undefined) {
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
            
                //if no error pass the request details, reviews, and momentjs to the ejs template
                res.render("./requests/show", {
                  request: foundRequest,
                  reviews: reviews,
                  moment: moment,
                  
                });
             });            
          };
        });
      });
    });  
});

// EDIT burn request

router.get("/requests/:id/edit", function(req, res) {
  // Load the generic query to see all burn request details

  // Find the burn request with provided ID

  fs.readFile('queries/requests/show.sql', 'utf8', function(err, requestquery) {
    if (err) throw err;
    // query the db for burn request details and return array foundrequest
    db.query(requestquery, req.params.id, function(error, foundrequest) {

      if (error) throw error;
      if (foundrequest[0] === undefined) {
        const errors = [{
          msg: 'No such burn exists'
        }];
        res.render('./fail', {
          errors: errors
        });
      } else {
        
       //if no error pass the request details, reviews, and momentjs to the ejs template
        res.render("./requests/edit", {
          request: foundrequest,
          moment: moment,
        });
      }
    });
  });
});

// UPDATE BURN REQUEST

router.put("/requests/:id", [
  // server-side form validation
  check('size').not().isEmpty().withMessage('Request acres is required'),
  check("start_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('Start date must be in YYYY-MM-DD format'),
  check("end_date").matches('^([0-9]{2,4})-([0-1][0-9])-([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$', "i").withMessage('End date must be in YYYY-MM-DD format'),
  
  ], function(req, res) {
  //
  console.log(req.body.start_date);
  console.log(req.body.end_date);
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    console.log(errors.array());
    //res.status(422).json({ errors: errors.array() });
    res.render('./fail', {
      errors: errors.array()
    });
  } else {
    
    //use native js to create a mySQL date for insertion into the db  
    var d = new Date();
    var sqlDate = d.toISOString().split('T')[0] + ' ' + d.toTimeString().split(' ')[0];

    // build an ARRAY to UPDATE burn_projects from form data
    // Couldn't figure out how to use an object due to the 
    // need to incorporate req.params.id in the WHERE clause
    var updateArray = [
      req.body.size,
      req.body.start_date,
      req.body.end_date,
      sqlDate,
      req.params.id
    ];
    fs.readFile('queries/requests/update.sql', 'utf8', function(err, updateQuery) {
      if (err) throw err;
      db.query(updateQuery, updateArray, function(err, result) {
        if (err) {
          throw err;
        } else {
          res.redirect("/requests/" + req.params.id);
        }
      });

    });
  }
});

// DELETE BURN PROJECT

router.delete("/requests/:id", function(req, res) {
  //
  db.query('DELETE FROM burns WHERE burn_id=?', req.params.id, function(err, result) {
    if (err) {
      throw err;
    } else {
      res.redirect("/requests/");
    };
  });
});


module.exports=router;