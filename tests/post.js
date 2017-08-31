var signAWS = require('../index');
var https = require('https');

var bodyData = JSON.stringify({
    module: {
        tags: [1,2,3,4,5]
    },
    template: {
        block1: 1,
        block2: 2
    }
});

var opts = {
    host: 'exampleapi.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'POST',
    body: bodyData,
    headers: {
        'Content-Type': 'application/json'
    }
};

signAWS(opts, function(signedOpts) {
    console.log('pushing with signed opts: ', signedOpts);
    var req = https.request(signedOpts, function(res) {
        var body = [];
        res.on('data', function(d) {
            body.push(d);
        });
        res.on('end', function() {console.log(body.join(''))});
    });
    req.write(bodyData);
    req.on('error', console.error);
    req.end();
});
