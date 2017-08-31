var signAWS = require('../index');
var https = require('https');

var deleteOpts = {
    host: 'exampleapi.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'DELETE'
};

signAWS(deleteOpts, function(signedOpts) {
    var req = https.request(signedOpts, function(res) {
        var body = [];
        res.on('data', function(d) {
            body.push(d);
        });
        res.on('end', function() {console.log(body.join(''))});
    });
    req.on('error', console.error);
    req.end();
});
