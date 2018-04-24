const attr = require('dynamodb-data-types').AttributeValue;

function put(tableName, item) {
  return new Promise((resolve, reject) => {
    this.db.putItem({
      TableName: tableName,
      Item: attr.wrap(item),
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
module.exports = put;
