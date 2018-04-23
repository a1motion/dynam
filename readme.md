# dynam
DynamoDB Wrapper

## Install
```
yarn add dynam
```
Or with NPM
```
npm i -S dynam
```

## Initialize
```js
const dynam = require('dynam');

// Read credentials from ~/.aws/credentials or envirnment
const db = new dynam();
// Change profile
const db = new dynam({profile: 'connor'});
// Change region
const db = new dynam({region: 'us-west-2'});
// Manually input
const db = new dynam({
  accessKeyId: '...',
  secretAccessKey: '...',
  region: 'us-west-2',
});
```

## Query
### dynam.query(TableName, Params) => Promise<Array>
```js
db.query('logs', {
  id: 'B1x6Omk23z'
}).then(function(results){
  console.log(results);
});
```
Outputs:
```js
[{
  id: 'B1x6Omk23z',
  time: 1524524731,
  ...
}]
```

## Scan
### dynam.scan(TableName, Params) => Promise<Array>
```js
db.query('logs', {
  type: 'event'
}).then(function(results){
  console.log(results);
});
```
Outputs:
```js
[{
  id: 'B1x6Omk23z',
  time: 1524524731,
  type: 'event'
},
{
  id: 'ByLv7y22G',
  time: 1524524882,
  type: 'event'
}]
```

## Conditions
#### Both query and scans accept conditions other than equals to.
| Symbol | Condition |
|-|-|
| = | Equal To |
| > | Greater Than |
| >= | Greater Than / Equal To |
| < | Less Than |
| =< | Less Than / Equal To |
| bw | Begins With (Strings) |
#### Example:
```js
db.scan('logs', {
  time '>'+Date.now() + (1000 * 60) // Past minute
});
```