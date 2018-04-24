const attr = require('dynamodb-data-types').AttributeValue;

function del(tableName, key) {
  const params = {
    TableName: tableName,
    Key: attr.wrap(key),
  };
  return new Promise((resolve, reject) => {
    this.db.deleteItem(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
module.exports = del;
