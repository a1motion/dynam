/* eslint-disable */
const expect = require('chai').expect;
const dynam = require("../lib/index");
const chaiAsPromised = require("chai-as-promised");
const shortid = require('shortid');
var db;
describe("DDB Init", () => {
  db = new dynam({ profile: "connor" });
  it("should return a ddb object", () => {
    expect(db).to.be.a.instanceof(dynam);
  });
  it("should embed db service into object", () => {
    expect(db).to.have.property("db");
  }); 
});
describe("DDB Query", () => {
  it('should find the item with the uid of test', (done) => {
    db.query('dynam', {
      uid: 'test',
    }).then((r) => {
      expect(r).to.be.an('array');
      expect(r).to.have.a.lengthOf(1);
      expect(r[0]).to.have.property('uid').equal('test');
      done();
    });
  });
});
describe("DDB Scan", () => {
  it('should find all items with a t value of 4', (done) => {
    db.scan('dynam', {
      t: 4
    }).then((r) => {
      expect(r).to.be.an('array');
      expect(r).to.have.a.lengthOf(1);
      expect(r[0]).to.have.property('t').equal(4);
      done();
    });
  });
});
var id = shortid.generate();
console.log(id);
describe('DDB Put', () => {
  it('should put the object into dynamodb', (done) => {
    db.put('dynam', {
      uid: id,
      t: 8,
    }).then(() => {
      db.query('dynam', {
        uid: id
      }).then((r) => {
        expect(r).to.be.an('array');
        expect(r).to.have.a.lengthOf(1);
        expect(r[0]).to.have.property('t').equal(8);
        expect(r[0]).to.have.property('uid').equal(id);
        done();
      });
    });
  });
});
describe('DDB Update', () => {
  it('should update the item that was inserted before', (done) => {
    db.update('dynam', {
      uid: id,
    }, {
      t: 9
    }).then(() => {
      db.query('dynam', {
        uid: id
      }).then((r) => {
        expect(r).to.be.an('array');
        expect(r).to.have.a.lengthOf(1);
        expect(r[0]).to.have.property('t').equal(9);
        expect(r[0]).to.have.property('uid').equal(id);
        done();
      });
    })
  });
  it('should add 4 to t of the item', (done) => {
    db.update('dynam', {
      uid: id,
    }, {
      t: '+4'
    }).then(() => {
      db.query('dynam', {
        uid: id
      }).then((r) => {
        expect(r).to.be.an('array');
        expect(r).to.have.a.lengthOf(1);
        expect(r[0]).to.have.property('t').equal(13);
        expect(r[0]).to.have.property('uid').equal(id);
        done();
      });
    })
  });
});
