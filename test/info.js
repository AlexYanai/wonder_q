process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('Info', () => {
  describe('/GET info', () => {
      it('it should GET queue and active counts', (done) => {
        chai.request(app)
            .get('/info')
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res).to.have.headers;
              expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
              expect(res.body).to.be.an('object');
              expect(Object.keys(res.body)).to.eql(['queue', 'active']);

              done();
            });
      });
  });
});