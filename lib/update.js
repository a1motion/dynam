const shortid = require('shortid');
const attr = require('dynamodb-data-types').AttributeValue;
const dep = require('depd')('dynam');

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
function update(tableName, key, updates) {
  const r = [];
  const values = {};
  const names = {};
  let expr = 'set ';
  Object.keys(updates).forEach((k, i) => {
    if (updates[k] === null) {
      dep('Use the remove method to remove attributes from an item.');
      r.push(k);
      return;
    }
    let id = shortid.generate();
    id = id.replace(/-/g, '_');
    const g = /^(-|(\+){1,2})/.exec(updates[k]);
    if (i !== 0) {
      expr += ', ';
    }
    if (g) {
      if (g[0] === '++') {
        expr += `#${id} = #${id} + :${id}`;
        updates[k] = 1;
      } else if (['+', '-', '/', '*'].includes(g[0])) {
        expr += `#${id} = #${id} ${g[0]} :${id}`;
        updates[k] = updates[k].substring(1);
        if (!Number.isNaN(Number(updates[k]))) {
          updates[k] = Number(updates[k]);
        }
      }
    } else if (typeof (updates[k]) === 'string') {
      if (updates[k].startsWith('.') && !/$(\.\.)/.test(updates[k])) {
        updates[k] = updates[k].substring(1);
        updates[k] = updates[k].replace(/$(\.\.)/, '.');
      }
      expr += `#${id} = :${id}`;
    } else {
      expr += `#${id} = :${id}`;
    }
    names[`#${id}`] = k;
    values[`:${id}`] = attr.wrap1(updates[k]);
  });
  return new Promise((resolve, reject) => {
    const param = {
      Key: attr.wrap(key),
      TableName: tableName,
      UpdateExpression: expr,
      ExpressionAttributeValues: values,
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
module.exports = update;
