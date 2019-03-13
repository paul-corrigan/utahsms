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
    res.render('./users/new');
});

// SHOW USER
router.get('/profile', authenticationMiddleware(), function(req, res, next){
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
       res.render('./users/fail', {errors: errors.array()});  //can't figure out how to handle this errors object
    } else {
        //Hash password
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            //Create new user object
            var newUser = {
            full_name:  req.body.name,
            email:      req.body.email,
            phone:      req.body.phone,
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
                    console.log(results[0]);
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

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`
      req.session.passport.user: ${JSON.
      stringify(req.session.passport)}`);
    if(req.isAuthenticated()) return next(
      );
    res.redirect('/login')
  }
}



module.exports=router;