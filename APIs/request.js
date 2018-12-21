var request = require('request');

var options = {
  url: 'https://api.open-elevation.com/api/v1/lookup\?locations\=39.161758,-112.583933',
  headers: {
    'User-Agent': 'Utah Smoke Management'
  }
};
 
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info.results);
    
  }
}
 
request(options, callback);