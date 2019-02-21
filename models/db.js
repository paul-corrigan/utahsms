//node framework to interface with mysql
var mysql = require('mysql');

// connect to the database.  in c9 also need to start the sql server by
// typing mysql-ctl start in the command line of the console.  
var db = mysql.createConnection({
  host : process.env.DB_HOST,
  user : process.env.DB_USER,
  database: process.env.DB_NAME
});

module.exports = db;