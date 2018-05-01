process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
const expect = chai.expect;
const rclient  = require('../store/client');
const client = rclient();

chai.use(chaiHttp);

describe('Receive', () => {
  beforeEach(function() {
    chai.request(app)
      .post('/add')
      .send({'message': 'test'})
      .end((err, res) => { });
  });

  describe('/GET receive', () => {
      it('it should GET a message id for a consumer', (done) => {
        chai.request(app)
          .get('/receive')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res).to.have.headers;
            expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
            expect(res.body).to.be.an('object');
            expect(res.body.messageId).to.exist;
            expect(res.body.messageId).to.be.an('string');

            done();
          });
      });
  });

  afterEach(function(done){
    client.rpop('queue', function(err, reply) {});
    done();
  });
});