//express is the node js framework for serving pages
var express         = require('express'),
    expressValidator= require('express-validator'), //validate user inputs server-side
    expressSanitizer= require("express-sanitizer"); //sanitize scripts etc. from user input
var cookieParser    = require('cookie-parser');
var bodyParser      = require("body-parser"); //body parser allows express to handle user input data from a post request
var async           = require("async"); // avoid nested callbacks


//authentication packages
var session     = require('express-session'); //session middleware for user functions -> keeps user logged in even if server restarts
var bcrypt      = require('bcrypt');
var saltRounds  = 10;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);

//node framework to interface with mysql
var mysql = require('mysql2/promise');

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

// path allows any combo of / and \ to work on both windows and unix 
var path = require('path');

// add the bootstrap script
app.use('/bootstrap', express.static(path.join(__dirname + '/node_modules/bootstrap/dist/')));
// add chosen
app.use('/chosen',    express.static(path.join(__dirname + '/node_modules/chosen/')));
// add jquery etc
app.use('/jquery',    express.static(path.join(__dirname + '/node_modules/jquery/dist/')));
app.use('/jqueryui',    express.static(path.join(__dirname + '/node_modules/jqueryui/')));
app.use('/dynatable',    express.static(path.join(__dirname + '/node_modules/jquery/dynatable/')));
app.use('/tablesorter',    express.static(path.join(__dirname + '/node_modules/tablesorter/dist/')));
app.use('/datatables',    express.static(path.join(__dirname + '/node_modules/jquery/datatables/')));
// add mapboxgl
app.use('/mapbox-gl', express.static(path.join(__dirname + '/node_modules/mapbox-gl/dist/')));
// point to static & public
app.use('/static',    express.static(path.join(__dirname + '/static')))
app.use('/public',    express.static(path.join(__dirname + '/public')))

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
  password: process.env.DB_PASSWORD,
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
  
//tells the app to look for type of HTTP request appended after _method
app.use(methodOverride("_method"));



//create logged in object - can't seem to access this in routes?
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
});

// use the required .js route files
app.use(projectRoutes);
app.use(requestRoutes);
app.use(userRoutes);
app.use(reportRoutes);
//app.use(reportRoutes); //for daily burn report form, not yet active 

// set up local strategy for passport for user auth
passport.use(new LocalStrategy(
  function(username, password, done) {
      fs.readFile('queries/user_login.sql', 'utf8', function(err, loginquery) {  
        if (err) throw err;
        //retrieve hashed pw from db based on user input email
        db.query(loginquery, username, 
        function(err, results, fields){
          //handle sql error
          if (err) {done(err)}
          console.log(results);
          // handle the case where the user does not exist
          if (results.length === 0) {
            done(null, false);
          } else {
            
            // compare the passwords
            const hash = results[0].password.toString();
            
            bcrypt.compare(password, hash, function(err, response){
              if (response === true) {
                //build a user object to store in session
                return done(null, { id      : results[0].user_id,
                                    agency  : results[0].agency,
                                    phone   : results[0].phone,
                                    email   : results[0].email,
                                    name    : results[0].full_name,
                                    active  : results[0].active
                })
              } else {
                console.log('pasword not correct')
                //handle incorrect password
                return done(null, false);
              }
            });
          }
        });  
    });
  }
));

// HOME PAGE
app.get("/", function(req, res){
    if (req.isauthenticated) {console.log(req.session.passport.user.user_email)}
    
    //shows the root folder for favicons, etc.
//     var appDir = path.dirname(require.main.filename);
//     console.log('main.filename: ' + appDir);
//     console.log(path.dirname(process.mainModule.filename));
  
  //  console.log(req.session);
    res.render("home", { username: req.user });
});


//MAP PAGE 
app.get("/map", function(req, res){
    res.render("map");
});


//lets you know the server is running
app.listen(3000, function () {
  console.log('App listening on port 3000!');
});
