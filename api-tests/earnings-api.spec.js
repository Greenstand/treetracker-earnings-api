require('dotenv').config();
const request = require('supertest');
const { expect, assert } = require('chai');
const { v4: uuid } = require('uuid');
const server = require('../server/app');
const {
  earnings: earningsOne,
  earningsPaid: earningsWithPaidStatus,
  earningsCancelled: earningsWithCancelledStatus,
} = require('./seed-data-creation');
const { GenericObject } = require('./generic-class');

describe('Earnings API tests.', () => {
  describe('Earnings PATCH', () => {
    it(`Should raise validation error with error code 422 -- id is required `, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('id');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- id should be a uuid `, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('id', 'id');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- worker_id should be required`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('worker_id');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- worker_id should be a uuid`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('worker_id', 'worker_id');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- amount should be required`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('amount');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- amount should be a number`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('amount', 'amount');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- currency should be required`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('currency');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- payment_confirmation_id should be required`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('payment_confirmation_id');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- payment_system should be required`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.delete_property('payment_system');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- paid_at should be an iso date`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('paid_at', 'paid_at');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise a 409 error -- paid status is not allowed to be updated`, function (done) {
      const earnings = new GenericObject({ ...earningsWithPaidStatus });
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise a 409 error -- cancelled status is not allowed to be updated`, function (done) {
      const earnings = new GenericObject({ ...earningsWithCancelledStatus });
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise a 409 error -- worker_id not the same as one in the database`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('worker_id', uuid());
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(409)
        .end(function (err, res) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise a 409 error -- currency not the same as one in the database`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('currency', 'NFT');
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise a 409 error -- amount not the same as one in the database`, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      earnings.change_property('amount', 5000000);
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should be successful `, function (done) {
      const earnings = new GenericObject({ ...earningsOne });
      request(server)
        .patch(`/earnings`)
        .send(earnings._object)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).eql({
            status: 'completed',
            count: 1,
          });
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('Earnings GET', () => {
    it(`Should raise validation error with error code 422 -- 'start_date' query parameter should be a date  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          start_date: 'start_date',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'end_date' query parameter should be a date  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          end_date: 'end_date',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          limit: 'limit',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be greater than 0  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          limit: 0,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be less than 101  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          limit: 101,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'offset' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          offset: 'offset',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'offset' query parameter should be at least 0  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          offset: -1,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should get earnings successfully`, function (done) {
      request(server)
        .get(`/earnings`)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys(['earnings', 'links']);
          expect(res.body.links).to.have.keys(['prev', 'next']);

          // test if surveys were added successfully
          const earnings = new GenericObject(earningsOne);

          let earnings_updated = false;
          for (const earning of res.body.earnings) {
            expect(earning).to.have.keys([
              'worker_id',
              'funder_id',
              'amount',
              'currency',
              'calculated_at',
              'consolidation_rule',
              'consolidation_period_start',
              'consolidation_period_end',
              'payment_confirmation_id',
              'payment_system',
              'payment_confirmed_by',
              'payment_confirmation_method',
              'paid_at',
              'payment_confirmed_at',
              'status',
              'batch_id',
            ]);
            if (
              earning.payment_confirmation_id ===
                earnings._object.payment_confirmation_id &&
              earning.payment_system === earnings._object.payment_system
            ) {
              expect(earning.status).equal('paid');
              earnings_updated = true;
            }
          }

          expect(earnings_updated).to.be.true;

          return done();
        });
    });
  });

  describe('Earnings Batch Patch', () => {
    it(`Should raise validation error with error code 422 -- all rows should be valid `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidRow.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; payment_system does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; payment_confirmation_id does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader2.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; worker_id does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader3.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; amount does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader4.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; currency does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader5.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- invalid headers; earnings_id does not exist `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsFailedTestInvalidHeader6.csv')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise conflict error with error code 409 -- one of the rows has status paid `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach(
          'csv',
          'api-tests\\earningsFailedTestRowWithNotCalculatedStatus.csv',
        )
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Successful batch request`, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', 'api-tests\\earningsSuccessfulTest.csv')
        .expect(200)
        .end(function (err, res) {
          expect(res.body).eql({
            status: 'completed',
            count: 3,
          });
          if (err) return done(err);
          return done();
        });
    });
  });

  // describe('Earnings BATCH GET', () => {
  //   const binaryParser = (res, callback) => {
  //     res.setEncoding('binary');
  //     res.data = '';
  //     res.on('data', function (chunk) {
  //       res.data += chunk;
  //     });
  //     res.on('end', function () {
  //       callback(null, Buffer.from(res.data, 'binary'));
  //     });
  //   };
  //   it(`Should get earnings successfully`, function (done) {
  //     request(server)
  //       .get(`/earnings/batch`)
  //       .expect('Content-Type', 'text/csv; charset=utf-8')
  //       .buffer()
  //       .parse(binaryParser)
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         expect(res.body instanceof Buffer).to.be.true;
  //         return done();
  //       });
  //   });
  // });
});
