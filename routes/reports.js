var express = require("express");
var router = express.Router(),
  expressValidator = require('express-validator'), //validate user inputs server-side
  expressSanitizer = require("express-sanitizer"); // sanitize scripts etc. from user input
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
// INDEX of Daily Emission reports
//
router.get("/reports", function(req, res) {
  res.render("./reports/index", {
  });  
  
});


//
// NEW Daily Emission report form
//



//
// CREATE Daily Emission report
//



//
// SHOW Daily Emission report
//



//
// EDIT Daily emission report form
//



//
// UPDATE Daily Emission report
//



//
// DELETE Daily Emission report
//



module.exports = router;