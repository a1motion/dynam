const attr = require('dynamodb-data-types').AttributeValue;

function batchGet(tableName, keys) {
  if (!tableName || typeof (tableName) !== 'string') {
    throw new Error('Table name must be a string');
  }
  if (!Array.isArray(keys)) {
    keys = [keys];
  }
  const param = {
    RequestItems: {},
  };
  param.RequestItems[tableName] = {

  };
  param.RequestItems[tableName].Keys = keys.map(a => attr.wrap(a));
  return new Promise((resolve, reject) => {
    this.db.batchGetItem(param, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Responses[tableName].map(attr.unwrap));
      }
    });
  });
}
module.exports = batchGet;
