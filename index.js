var aws4 = require('aws4');
var http = require('http');

    var requestPromise = function(resolve, reject) {
        return function(response) {
            var body = [];

            response.on('data', function(c) {body.push(c)});
            response.on('end', function() {
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
    var ec2MetadataOpts = {
        host: '169.254.169.254',
        path: '/latest/meta-data/iam/security-credentials/'
    };

    var temporaryCredentials = new Promise(function(resolve, reject) {
        http.get(ec2MetadataOpts, requestPromise(resolve, reject));
    });
    temporaryCredentials.then(function(data) {
        ec2MetadataOpts.path = ec2MetadataOpts.path + data;
        var ec2Creds = new Promise(function(resolve, reject) {
            console.log('attempting to get creds with opts: ', ec2MetadataOpts);
            http.get(ec2MetadataOpts, requestPromise(resolve, reject));
        });
        ec2Creds.then(function(credsJsonString) {
            try {
                var credentialsJSON = JSON.parse(credsJsonString);

                requestOpts = aws4.sign(requestOpts, {accessKeyId: credentialsJSON.AccessKeyId, secretAccessKey: credentialsJSON.SecretAccessKey, sessionToken: credentialsJSON.Token});
                callback(requestOpts);
            } catch(e) {
                console.error('Error parsing json: ', e);
            }
        }).catch(console.error);
    }).catch(console.error);
};

module.exports = signAWSRequests;