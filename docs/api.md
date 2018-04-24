# API

* [dynam(options = { })](#dynam)
* [dynam.query(TableName, Conditions)](#dynamquerytablename-conditions)

## dynam(options = { }) => dynam
** Initializes the dynam wrapper. **

By default dynam will read AWS credentials from your ~/.aws/credentials file, or the from your envirment variables.
This can be overwritten by passing the exact id and key or by passing the profile name. You can also pass in the 
```js
var options = {
  region: String,
  profile: String,
  accessKeyId: String,
  secretAccessKey: String
};
```

## dynam.query(TableName, Conditions)
** Query for item matching conditions **

See [Conditions](#condtions) for help with condtions

## Conditions
dynam takes conditions in the form of an object then converts that into the necessary parameters for DynamoDB.

### Example
The follow will match any item that has the id of "fj9oate9":
```js
Conditions = {
  id: "fj9oate9"
}
```
This get converted into:
```js
Params = {
  KeyConditionExpression: ':HkNELz63M = #HkNELz63M',
  ExpressionAttributeValues: { ':HkNELz63M': { S: 'fj9oate9' } },
  ExpressionAttributeNames: { '#HkNELz63M': 'id' } }
}
```
*Dynam will transform any attribute name or value into a special id to avoid reversed keywords.*

Dynam also supports more advanced conditions such comparsions.

| Symbol | Condition |
|-|-|
| = | Equal To |
| > | Greater Than |
| >= | Greater Than / Equal To |
| < | Less Than |
| =< | Less Than / Equal To |
| bw | Begins With (Strings) |

The follow will match any times with a time greater than 1524602759:

```js
Conditions = {
  time: '>1524602759'
}
```