var faker = require('faker');
var mysql = require('mysql');
var express = require('express');
var app = express();
var bcrypt      = require('bcrypt');
var saltRounds  = 10;
var async = require('async');
// making the db connection available 
//var db = require('./db');


// app.get("/", function(req, res){
//   res.send("HELLO FROM OUR WEB APP!");
// });

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});

function fastFunction (done) {
  setTimeout(function () {
    done()
  }, 100)
  console.log('Fast')
}

function slowFunction (done) {
  setTimeout(function () {
    done()
  }, 300)
  console.log('Slow')
}
  
 async.waterfall([fastFunction, slowFunction], () => {
 console.log('done')
 })

// function countDown(seconds) {
  
//  var intervalId = setInterval(function(){
//    console.log(seconds); 
//    seconds--;
//     if (seconds === 0) {
//       console.log('Ding Ding Ding');
//       clearInterval(intervalId); }
//   }, 1000);
// }

// countDown(5);

//some one time code to populate db etc.

// var q = 'SELECT count(*) AS total FROM users';

// var result = db.query(q, function(error, results, fields) {
//   if(error) throw error;
//   return results[0].total;
// });

// console.log(result);
// bcrypt.hash('', saltRounds, function(err, hash) {
//             //Create new user object
//       console.log(hash);
        
//         var q = 'UPDATE users SET password = \'' + hash + '\'';
//         console.log(q);
//         db.query(q, function(err, result) {
//             console.log(result);
//         });
      
// });


//db.end();