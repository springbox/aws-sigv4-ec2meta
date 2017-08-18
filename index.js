const aws4 = require('aws4');
const http = require('http');

    const requestPromise = function(resolve, reject) {
        return (response) => {
            let body = [];

            response.on('data', c => body.push(c));
            response.on('end', () => {
                body = body.join('');
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to load page, status code: ' + response.statusCode + " with body " + body));
                } else {
                    resolve(body);
                }
            });
        };
    };

const signAWSRequests = function(requestOpts, callback) {
    let ec2MetadataOpts = {
        host: '169.254.169.254',
        path: '/latest/meta-data/iam/security-credentials/'
    };

    const temporaryCredentials = new Promise((resolve, reject) => {
        http.get(ec2MetadataOpts, requestPromise(resolve, reject));
    });
    temporaryCredentials.then((data) => {
        ec2MetadataOpts.path = ec2MetadataOpts.path + data;
        const ec2Creds = new Promise((resolve, reject) => {
            console.log('attempting to get creds with opts: ', ec2MetadataOpts);
            http.get(ec2MetadataOpts, requestPromise(resolve, reject));
        });
        ec2Creds.then((credsJsonString) => {
            try {
                const credentialsJSON = JSON.parse(credsJsonString);

                requestOpts = aws4.sign(requestOpts, {accessKeyId: credentialsJSON.AccessKeyId, secretAccessKey: credentialsJSON.SecretAccessKey, sessionToken: credentialsJSON.Token});
                callback(requestOpts);
            } catch(e) {
                console.error('Error parsing json: ', e);
            }
        }).catch(console.error);
    }).catch(console.error);
};

module.exports = signAWSRequests;