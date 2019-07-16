var mysql = require('mysql2');

// db credentials etc in config file .env which is .gitignored
require('dotenv').config();
var db;

function connectDatabase() {
    if (!db) {
        var db = mysql.createConnection({
              host : process.env.DB_HOST,
              user : process.env.DB_USER,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              multipleStatements: true
            });
        db.connect(function(err){
            if(!err) {
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database!');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();