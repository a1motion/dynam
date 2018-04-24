const aws = require('aws-sdk');
const query = require('./query');
const scan = require('./scan');
const put = require('./put');
const update = require('./update');
const debug = require('debug')('dynam');
const del = require('./delete');

function dynam(opts) {
  try {
    try {
      const credentials = new aws.SharedIniFileCredentials({
        profile: opts.profile || 'default',
      });
      aws.config.credentials = credentials;
    } catch (e) {
      debug.log('Credentials not found');
    }
    /**
     * This is the DynamoDB Service holder.
     */
    this.db = new aws.DynamoDB({
      accessKeyId: opts.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: opts.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
      region: opts.region || 'us-east-1',
    });
    this.db.describeLimits({}, (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (e) {
    throw new Error(e);
  }
  this.query = query;
  this.scan = scan;
  this.put = put;
  this.update = update;
  this.delete = del;
  return this;
}

module.exports = dynam;
