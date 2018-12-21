var faker = require('faker');
var mysql = require('mysql');
var express = require('express');
var app = express();

var connection = mysql.createConnection({
  host : 'localhost',
  user : 'pcorrigan',
  database: 'utahsms'
});

app.get("/", function(req, res){
  res.send("HELLO FROM OUR WEB APP!");
});

app.listen(8080, function () {
  console.log('App listening on port 8080!');
});


// var q = 'SELECT count(*) AS total FROM users';

// var result = connection.query(q, function(error, results, fields) {
//   if(error) throw error;
//   return results[0].total;
// });

// console.log(result);


// var q = 'INSERT INTO users (email, created_at) VALUES ?';

// connection.query(q, [data], function(err, result) {
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