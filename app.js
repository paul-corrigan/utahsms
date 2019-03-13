//express is the node js framework for serving pages
var express         = require('express'),
    expressValidator= require('express-validator'), //validate user inputs server-side
    expressSanitizer= require("express-sanitizer"); //sanitize scripts etc. from user input
var cookieParser    = require('cookie-parser');
var bodyParser      = require("body-parser"); //body parser allows express to handle user input data from a post request
    
//authentication packages
var session     = require('express-session'); //session middleware for user functions -> keeps user logged in even if server restarts
var bcrypt      = require('bcrypt');
var saltRounds  = 10;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

//node framework to interface with mysql
var mysql = require('mysql');

//easy way to verify query results, print the table to the console
var cTable = require('console.table');

// making the db connection available 
var db = require('./db');

// fs is a node package for interacting with a file system
// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');

//method-override allows put and delete request HTTP routing, not supported by HTML
var methodOverride = require('method-override');

//modularize routes to clean up the app.js
var projectRoutes = require('./routes/projects'),
    requestRoutes = require('./routes/requests'),
    userRoutes    = require('./routes/users'),
    reportRoutes  = require('./routes/reports');

//use express
var app = express();

//tell express to assume .ejs extension to render route template files
app.set("view engine", "ejs");

//need to activate bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//express-sanitizer&validator go immediately after bodyparser
app.use(expressSanitizer());
app.use(expressValidator())


app.use(cookieParser());
//connect additional directories to serve css stylesheets etc.
app.use(express.static("public"));

//db config for sessions
var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  database : process.env.DB_NAME
};

//runs schema to create a sessions table in the db
// allows persistent user session even if server restarts
var sessionStore = new MySQLStore(options);

//config for user sessions
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'h6YA4UFpZWpucfFkuQ5D',
  resave: false,
  store: sessionStore,
  saveUninitialized: false,
  cookie: { secure: true }
}))

//authentication 
app.use(passport.initialize());
app.use(passport.session());
  
//tells the app to look for type HTTP request appended after _method
app.use(methodOverride("_method"));

//create global object for user
app.use(function(req, res, next){
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// use the required .js route files
app.use(projectRoutes);
app.use(requestRoutes);
app.use(userRoutes);
//app.use(reportRoutes);

passport.use(new LocalStrategy(
  function(username, password, done) {
      console.log(username);
      // console.log(password);
      const db = require('./db');
      
      db.query('SELECT user_id, password FROM users WHERE email = ?',
      [username],
      function(err, results, fields){
        if (err) {done(err)};
        
        // handle the case where the user does not exist
        if (results.length === 0) {
          done(null, false);
        } else {
          
          // compare the passwords
          const hash = results[0].password.toString();
          
          bcrypt.compare(password, hash, function(err, response){
            if (response === true) {
              return done(null, {user_id: results[0].user_id})
            } else {
              
              //handle incorrect password
              return done(null, false);
            }
          });
        }
      });
  }
));

// HOME PAGE
app.get("/", function(req, res){
    console.log(req.user);
    console.log(req.session);
    console.log(req.isAuthenticated());
    res.render("home");
});

//lets you know the server is running
app.listen(8080, function () {
  console.log('App listening on port 8080!');
});


