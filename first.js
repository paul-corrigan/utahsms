var faker = require('faker');
var mysql = require('mysql');
var express = require('express');
var app = express();

// making the db connection available 
var db = require('./db');


app.get("/", function(req, res){
  res.send("HELLO FROM OUR WEB APP!");
});

app.listen(8080, function () {
  console.log('App listening on port 8080!');
});

//some one time code to sanitize user info, populate db etc.

// var q = 'SELECT count(*) AS total FROM users';

// var result = db.query(q, function(error, results, fields) {
//   if(error) throw error;
//   return results[0].total;
// });

// console.log(result);

// var q = 'INSERT INTO users (email, created_at) VALUES ?';

// db.query(q, [data], function(err, result) {
//     console.log(err);
//     console.log(result);
// });

// var data = [];

// for(var i = 0; i < 500; i++){
//   var fullname = faker.name.firstName() + ' ' + faker.name.lastName();
//   data.push([fullname]);
//   console.log(fullname);
// }


connection.end();