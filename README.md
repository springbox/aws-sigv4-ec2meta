# aws-sigv4-ec2meta
Signs an http(s) request options object with AWS Signature Version 4 headers and returns them

# Sample Usage
Use the `signAWS` function provided by the module to add the appropriate cryptographically secure headers to an http or https request options object.  This function accepts an options object as the first parameter and a callback as the second parameter. 

```
let signAWS = require('./aws-sigv4-ec2metadata/index.js');
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

```

# Testing Locally
To test locally, use the [aws-mock-metadata](https://github.com/dump247/aws-mock-metadata.git) library to simulate an ec2 instance profile environment.
### Steps to Install on OSX

1. Boto dependency
    1. `sudo easy_install pip`
    1. `pip install boto`    
1. Clone https://github.com/dump247/aws-mock-metadata.git
1. Configure aws-mock-metadata
    1. Create a `server.conf` file in the root of the aws-mock-metadata folder (see server.conf.sample for an example of this)
    1. Replace the **** values in this file with your AWS user access key and secret key
1. Start the mock metadata server by running `./bin/server-macos`
1. Verify the server is running and configured correctly by hitting [the metadata url](http://169.254.169.254/latest/meta-data/iam/security-credentials/local-credentials) in your local browser 

**Note that your user account and/or ec2 instance profile role must have the `execute-api` policy for a given resource in order to query AWS_IAM protected API methods.** 