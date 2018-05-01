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

describe('Add', () => {
  describe('/POST add', () => {
      it('it should POST a message to a queue', (done) => {
        const m = {'message': 'test'};

        chai.request(app)
          .post('/add')
          .send(m)
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

      it('it should increase queued message count by 1', (done) => {
        const m = {'message': 'test'};

        chai.request(app)
          .get('/info')
          .then(function(res1) {
            chai.request(app)
              .post('/add')
              .send(m).then(function(res2) {
                chai.request(app)
                  .get('/info')
                  .then(function(res3) {
                    expect(res1.body['queue'] + 1).to.equal(res3.body['queue']);
                  });
              })
          })

        done();
      });
  });

  afterEach(function(done) {
    client.rpop('queue', function(err, reply) {});
    done();
  });
});