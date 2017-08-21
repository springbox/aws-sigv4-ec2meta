let signAWS = require('../index');
let https = require('https');

let deleteOpts = {
    host: 'exampleapi.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'DELETE'
};

signAWS(deleteOpts, (signedOpts) => {
    let req = https.request(signedOpts, (res) => {
        let body = [];
        res.on('data', (d) => {
            body.push(d);
        });
        res.on('end', () => console.log(body.join('')));
    });
    req.on('error', console.error);
    req.end();
});
