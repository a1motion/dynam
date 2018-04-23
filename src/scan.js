const shortid = require('shortid');
const attr = require('dynamodb-data-types').AttributeValue;

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_@');
function scan(tableName, params) {
  const values = {};
  const names = {};
  let expr = '';
  Object.keys(params).forEach((key, i) => {
    const id = shortid.generate();
    const g = /^(=|<|>|<=|>=|bw)/.exec(params[key]);
    let op = '=';
    const val = true;
    let exp = true;
    if (i !== 0) {
      expr += ' and ';
    }
    if (g) {
      if (['>', '<', '=', '>=', '=<'].includes(g[0])) {
        params[key] = params[key].substring(g[0].length);
        [op] = g;
      } else if (g[0] === 'bw') {
        exp = false;
        expr += `begins_with(:${id}, #${id})`;
      }
    } else {
      if (typeof (params[key]) === 'string') {
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
        expr += `:${id} ${op} #${id}`;
      }
    }
  });
  return new Promise((resolve, reject) => {
    const items = [];
    const param = {
      TableName: tableName,
      FilterExpression: expr,
      ExpressionAttributeValues: values,
      ExpressionAttributeNames: names,
    };
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
