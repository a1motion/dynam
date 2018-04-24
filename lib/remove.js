const shortid = require('shortid');
const attr = require('dynamodb-data-types').AttributeValue;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
function remove(tableName, key, removes) {
  if (!Array.isArray(removes)) {
    removes = [removes];
  }
  const names = {};
  let expr = 'remove ';
  removes.forEach((e, i) => {
    let id = shortid.generate();
    id = id.replace(/-/g, '_');
    if (i !== 0) {
      expr += ', ';
    }
    expr += `#${id}`;
    names[`#${id}`] = e;
  });
  return new Promise((resolve, reject) => {
    const param = {
      Key: attr.wrap(key),
      TableName: tableName,
      UpdateExpression: expr,
      ExpressionAttributeNames: names,
    };
    this.db.updateItem(param, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
module.exports = remove;
