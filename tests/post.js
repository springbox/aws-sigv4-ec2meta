let signAWS = require('../index');
let https = require('https');

const bodyData = JSON.stringify({
    module: {
        tags: [1,2,3,4,5]
    },
    template: {
        block1: 1,
        block2: 2
    }
});

let opts = {
    host: 'gu0rkom2gb.execute-api.us-west-2.amazonaws.com',
    path: '/api/configs/1',
    method: 'POST',
    body: bodyData,
    headers: {
        'Content-Type': 'application/json'
    }
};

signAWS(opts, (signedOpts) => {
    console.log('pushing with signed opts: ', signedOpts);
    let req = https.request(signedOpts, (res) => {
        let body = [];
        res.on('data', (d) => {
            body.push(d);
        });
        res.on('end', () => console.log(body.join('')));
    });
    req.write(bodyData);
    req.on('error', console.error);
    req.end();
});
