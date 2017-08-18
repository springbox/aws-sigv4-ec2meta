let signAWS = require('../index');
let https = require('https');

let postOpts = {
    host: 'gu0rkom2gb.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'POST',
    region: 'us-west-2',
    service: 'execute-api',
    body: JSON.stringify({
        "schema": {
            "message": "text schema"
        }
    })
};

console.log('posting new object: ', postOpts);

signAWS(postOpts, (signedOpts) => {
    console.log('request is signed, attempting to execute: ', JSON.stringify(signedOpts));
    let req = https.request(signedOpts, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });
    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
});


let deleteOpts = {
    host: 'gu0rkom2gb.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'DELETE',
    region: 'us-west-2',
    service: 'execute-api'
};

console.log('deleting new object: ', deleteOpts);

signAWS(deleteOpts, (signedOpts) => {
    console.log('request is signed, attempting to execute: ', JSON.stringify(signedOpts));
    let req = https.request(signedOpts, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });
    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
});
