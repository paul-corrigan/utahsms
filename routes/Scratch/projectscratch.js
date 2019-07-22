
    //could try to refactor these 7 promises by creating an array of objects and looping over/mapping it?
//     var newProjectQueryArray =[      
//       { name: 'ertQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'erts' },
//       { name: 'countyQ',
//         query: 'SELECT county_id AS number, name FROM counties',
//         result: 'counties' },
//       { name: 'methodQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'erts' },
//       { name: 'agencyQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'erts' },
//       { name: 'objectiveQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'erts' },
//       { name: 'fuelmodQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'fuelmods' },
//       { name: 'airshedQ',
//         query: 'SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC',
//         result: 'airsheds' }     
//     ];
//     var promises = []; //array of promises
  
//     newProjectQueryArray.map(function (each){
//         var promise = new Promise(function(resolve, reject) {
//            db.query(each.query, 
//            function(err, each.result) { if (err) return reject( err); resolve(each.result); });   
//         });   
//         promises.push(promise);
//     });

      
      //       const query.name = new Promise((resolve, reject) =>{
//         db.name
//       });      
   // });  
// Tried this approach to putting this all in one promise but had no luck yet.
//   new Promise(function(resolve, reject) {
//       db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', function(error, erts) {
//         if (error) throw error; console.log('query1'); resolve(erts)   });
//       db.query('SELECT county_id AS number, name FROM counties', function(error, counties) {
//         if (error) throw error; console.log('query2'); resolve(counties)   });
//       db.query('SELECT ignition_method_id AS number, name FROM ignition_methods', function(error, methods) {
//         if (error) throw error; console.log('query3'); resolve(methods)   });
//       db.query('SELECT agency_id AS number, agency AS name, display AS display FROM agencies ORDER BY name DESC', function(error, agencies) {
//         if (error) throw error; console.log('query4'); resolve(agencies)   });
//       db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', function(error, fuelmods) {
//         if (error) throw error; console.log('query5'); resolve(fuelmods)   });
//       db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
//         if (error) throw error; console.log('query6'); resolve(airsheds)   });
//       db.query('SELECT pre_burn_objective_preset_id AS number, name FROM pre_burn_objective_presets', function(error, objectives) {
//         if (error) throw error; console.log('query7'); resolve(objectives)   });
    

        //   }).then((result) => {
//       console.log("erts: " + erts[0].name);
//       console.log("erts: " + counties[0].name);
//       console.log("erts: " + methods)[0].name;
//       console.log(result);

    

//   Also tried to clean up the nested callbacks with this approach but couldn't get it to work. 

//   async function getArgs() {
//   const mysql = require('mysql2/promise');
//   const conn = await mysql.createConnection({ database: process.env.DB_NAME,
//                                             host : process.env.DB_HOST,
//                                             user : process.env.DB_USER,
//                                             password: process.env.DB_PASSWORD,
//                                             });
//     try {
//     const erts        = await conn.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC'); 
//     const counties    = await conn.query('SELECT county_id AS number, name FROM counties'); 
//     const methods     = await conn.query('SELECT ignition_method_id AS number, name FROM ignition_methods'); 
//     const agencies    = await conn.query('SELECT agency_id AS number, agency AS name FROM agencies ORDER BY name DESC'); 
//     const fuelmods    = await conn.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types'); 
//     const airsheds    = await conn.query('SELECT airshed_id AS number, name FROM airsheds'); 
//     const objectives  = await conn.query('SELECT pre_burn_objective_preset_id AS number, name FROM pre_burn_objective_presets'); 
//     } catch (err) {
//     res.render("./projects/new", {
//                 erts: erts, 
//                 counties: counties, 
//                 methods:methods, 
//                 agencies:agencies, 
//                 objectives:objectives, 
//                 fuelmods: fuelmods, 
//                 airsheds:airsheds
//       });
//     }
//   }

//   getArgs();

// });


//  Original method, ugly but short.
//  The nested callbacks generate the needed arrays to pass to the template for the form drop-downs
//  some of these not likely to change and could hard-code in the HTML, such as county, but others might  

//   db.query('SELECT emission_reduction_technique_id AS number, name FROM emission_reduction_techniques ORDER BY number DESC', function (error, erts) {
//     if (error) throw error;
//     db.query('SELECT county_id AS number, name FROM counties', function (error, counties) {
//       if (error) throw error;
//       db.query('SELECT ignition_method_id AS number, name FROM ignition_methods', function(error, methods) {
//         if (error) throw error;
//         db.query('SELECT agency_id AS number, agency AS name, display AS display FROM agencies ORDER BY name DESC', function(error, agencies) {
//           if (error) throw error;
//           db.query('SELECT fuel_type_id AS number, fuel_type AS name FROM fuel_types', function(error, fuelmods) {
//             if (error) throw error;
//             db.query('SELECT airshed_id AS number, name FROM airsheds', function(error, airsheds) {
//               if (error) throw error;
//               db.query('SELECT pre_burn_objective_preset_id AS number, name FROM pre_burn_objective_presets', function(error, objectives) {
//                 if (error) throw error;
//                 //direct to form template, passing object to populate dropdowns
//                 res.render("./projects/new", {
//                 erts: erts, 
//                 counties: counties, 
//                 methods:methods, 
//                 agencies:agencies, 
//                 objectives:objectives, 
//                 fuelmods: fuelmods, 
//                 airsheds:airsheds});

//               });
//             });
//           });
//         });  
//       });
//     });
//   });  
// });




