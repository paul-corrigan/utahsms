var express = require("express"),
    expressValidator= require('express-validator'), //validate user inputs server-side
    expressSanitizer = require("express-sanitizer"); // sanitize scripts etc. from user input
const { check, validationResult } = require('express-validator/check');

//node library to hash passwords - other options for this but going with bcrypt for now
const bcrypt        = require('bcrypt');
const saltRounds    = 10;
var session         = require('express-session'); //session -> keeps user logged in even if server restarts
var passport        = require('passport');
// var LocalStrategy   = require('passport-local').Strategy;
var MySQLStore      = require('express-mysql-session')(session);  // -> keeps user logged in even if server restarts
var router          = express.Router();

// making the db connection available IF IN ROUTE FOLDER START PATH WITH DOUBLE DOTS ..
var db = require('../db');

// using this to read the .sql query files into a variable
var fs = require('fs');

//date handling to make SQL inserts and selects easier
var moment = require('moment');

// can't seem to get this working right
// var middlewares = require("../middlewares");
// router.use(middlewares.isLoggedIn);

// LOGIN 
router.get('/login', function(req, res, next){
    res.render('./users/login');
}); 

// LOGOUT ROUTE
router.get('/logout', function(req, res) {
   req.logout();
   req.session.destroy();
   res.redirect('/');
});


// LOG USER IN IF AUTHENTICATED
router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

// NEW USER
router.get('/register', function(req, res, next){
      //these nested callbacks query the db to fill dropdown options
  
        db.query('SELECT agency_id AS number, agency AS name FROM agencies ORDER BY name DESC', function(error, agencies) {
          if (error) throw error;
          db.query('SELECT district_id AS number, agency_id AS d_a_id, district, identifier FROM districts', function(error, districts) {
            if (error) throw error;
            db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
              if (error) throw error;
              res.render("./users/new", {agencies:agencies, });
            });
          });
        });  
    
});
   

// SHOW USER
router.get('/profile', isLoggedIn(), function(req, res, next){
   res.render('./users/show') ;
});

// CREATE USER
router.post('/register', [
    
  // server-side form validation
  check('name').not().isEmpty().withMessage('Name is required'),
  check('phone').not().isEmpty().withMessage('Phone is required'),
  check('email').isEmail().withMessage('Invalid email address'),
  check("password").isLength({ min: 12 }).withMessage('Password must be 12 characters long'),
  check("password").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{12,}$/, "i").withMessage('Password must contain at least one upper, lower, number, and special'),
  check("password").custom((value,{req, loc, path}) => {
            if (value !== req.body.passwordMatch) {
                // throw error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
    })
  
  ], function(req, res, next){
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()) {
        console.log(errors.array());
        //res.status(422).json({ errors: errors.array() });
       res.render('./fail', {errors: errors.array()});  //can't figure out how to handle this errors object
    } else {
        //sanitize inputs- take any script tags out of text fields for security purposes
        //append .param to these new variables to get that input
        var name = req.sanitize(req.body.name);
        var email= req.sanitize(req.body.email);
        var phone= req.sanitize(req.body.phone);
        //Hash password
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            //Create new user object
            var newUser = {
            full_name:  name.param,
            email:      email.param,
            phone:      phone.param,
            agency_id:  req.body.agency_id,
            password:   hash,
            active:     0,
            level_id:   3
            }
            // Store user info in  DB.
            db.query('INSERT INTO users SET?', newUser, function(error, results, fields){
                if(error) throw error;
                db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields){
                    if (error) throw error;
                    const user_id = results[0];
                    req.login(user_id, function(err){
                        res.redirect('/');
                    });
                //res.render('./users/success', {name: req.body.name});
                })
            });
        });
    }
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id);
});

function isLoggedIn() {
  return (req, res, next) => {
    
    if(req.isAuthenticated()) return next(
      );
    res.redirect('/login')
  }
}



module.exports=router;