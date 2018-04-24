const aws = require('aws-sdk');
const query = require('./query');
const scan = require('./scan');
const put = require('./put');
const update = require('./update');
const del = require('./delete');
const remove = require('./remove');
const batchGet = require('./batchGet');
const debug = require('debug')('dynam');

function dynam(opts) {
  try {
    try {
      const credentials = new aws.SharedIniFileCredentials({
        profile: opts.profile || 'default',
      });
      aws.config.credentials = credentials;
    } catch (e) {
      debug('Credentials not found');
    }
    /**
     * This is the DynamoDB Service holder.
     */
    opts = opts || {};
    if (!opts.region) {
      opts.region = 'us-east-1';
    }
    this.db = new aws.DynamoDB(opts);
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
  this.remove = remove;
  this.batchGet = batchGet;
  return this;
}

module.exports = dynam;
