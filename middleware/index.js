var session         = require('express-session');

// functions common across routes, such as user auth 
var middlewareObj = {};

// middlewareObj.isLoggedIn = function (req, res, next) {
// //     console.log(`
// //       req.session.passport.user: ${JSON.
// //       stringify(req.session.passport)}`);
//     if(req.isAuthenticated()) return next(
//       );
//     res.redirect('/login')
// }
  
module.exports = middlewareObj;

