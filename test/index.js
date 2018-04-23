/* eslint-disable */
const expect = require('chai').expect;
const dynam = require("../src/index");
const chaiAsPromised = require("chai-as-promised");
var db;
describe("DDB Init", () => {
    db = new dynam({profile: "connor"});
    console.log(db);
    it("should return a ddb object", () => {
        expect(db).to.be.a.instanceof(dynam);
    });
    it("should embed db service into object", () => {
        expect(db).to.have.property("db");
    });
});
describe("DDB Query", async () => {
  console.log(await db.query('dynam', {
    uid: 'test',
  }));
  console.log(await db.scan('dynam', {
    t: '<1',
  }));
});