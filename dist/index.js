'use strict';

const aws = require('aws-sdk');
const query = require('./query');
const scan = require('./scan');

function dynam(opts) {
  try {
    if (opts.profile) {
      const credentials = new aws.SharedIniFileCredentials({
        profile: opts.profile
      });
      aws.config.credentials = credentials;
    }
    /**
     * This is the DynamoDB Service holder.
     */
    this.db = new aws.DynamoDB({
      accessKeyId: opts.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: opts.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      region: opts.region || 'us-east-1'
    });
    this.db.describeLimits({}, err => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
  this.query = query;
  this.scan = scan;
  return this;
}

module.exports = dynam;
//# sourceMappingURL=index.js.map