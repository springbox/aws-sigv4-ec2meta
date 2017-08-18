const aws4 = require('aws4');
const http = require('http');

const requestPromise = function(resolve, reject) {
    return (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
            reject(new Error('Failed to load page, status code: ' + response.statusCode));
        }

        let body = [];
        response.on('data', (chunk) => body.push(chunk));
        response.on('end', () => resolve(body.join('')));
    };
};

const signAWSRequests = function(requestOpts, overrides, callback) {
    if (typeof callback === 'undefined' && typeof overrides === 'function') {
        callback = overrides;
    }

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
        }).catch(err => console.log('Error: ', err));

    }).catch(err => console.log('Error: ', err));
};

module.exports = signAWSRequests;