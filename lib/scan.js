const shortid = require('shortid');
const attr = require('dynamodb-data-types').AttributeValue;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-');
function scan(tableName, params) {
  if (!tableName || typeof (tableName) !== 'string') {
    throw new Error('Table name must be a string');
  }
  const values = {};
  const names = {};
  let expr = '';
  if (params && typeof (params) === 'object') {
    Object.keys(params).forEach((key, i) => {
      let id = shortid.generate();
      id = id.replace(/-/g, '_');
      const g = /^(=|<|>|<=|>=|bw\((.*)\)|c\((.*)\))/.exec(params[key]);
      let op = '=';
      const val = true;
      let exp = true;
      if (i !== 0) {
        expr += ' and ';
      }
      if (g) {
        if (['>', '<', '=', '>=', '=<'].includes(g[0])) {
          params[key] = params[key].substring(g[0].length);
          if (!Number.isNaN(Number(params[key]))) {
            params[key] = Number(params[key]);
          }
          [op] = g;
        } else if (g[0].startsWith('bw(')) {
          exp = false;
          [,, params[key]] = g;
          if (!Number.isNaN(Number(params[key]))) {
            params[key] = Number(params[key]);
          }
          expr += `begins_with(#${id}, :${id})`;
        } else if (g[0].startsWith('c(')) {
          exp = false;
          [,,, params[key]] = g;
          expr += `contains(#${id}, :${id})`;
        }
      } else if (typeof (params[key]) === 'string') {
        if (params[key].startsWith('.') && !/$(\.\.)/.test(params[key])) {
          params[key] = params[key].substring(1);
          params[key] = params[key].replace(/$(\.\.)/, '.');
        }
      }
      names[`#${id}`] = key;
      if (val) {
        values[`:${id}`] = attr.wrap1(params[key]);
      }
      if (exp) {
        expr += `#${id} ${op} :${id}`;
      }
    });
  }
  return new Promise((resolve, reject) => {
    const items = [];
    const param = {
      TableName: tableName,
      FilterExpression: expr,
      ExpressionAttributeValues: values,
      ExpressionAttributeNames: names,
    };
    if (Object.keys(values).length === 0) {
      delete param.ExpressionAttributeValues;
    }
    if (Object.keys(names).length === 0) {
      delete param.ExpressionAttributeNames;
    }
    if (!param.ExpressionAttributeNames && !param.ExpressionAttributeValues) {
      delete param.FilterExpression;
    }
    const onScan = (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      items.push(...data.Items.map(attr.unwrap));
      if (typeof data.LastEvaluatedKey !== 'undefined') {
        param.ExclusiveStartKey = data.LastEvaluatedKey;
        this.db.scan(param, onScan);
      } else {
        resolve(items);
      }
    };
    this.db.scan(param, onScan);
  });
}
module.exports = scan;
