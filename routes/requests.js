var express = require("express");
var router  = express.Router();

// making the db connection available IF IN ROUTE FOLDER START PATH WITH DOUBLE DOTS ..
var db = require('../db');

// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');


// INDEX BURN REQUESTS

router.get("/requests", function(req, res){
 
    //read the query file 
    fs.readFile('queries/burn_request_list.sql', 'utf8', function(err, data) {  
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

//directs to the new request form
    res.render("./requests/new");
});

// CREATE posts a submitted burn request form to the db
router.post("/requests", function(req, res){
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



module.exports=router;