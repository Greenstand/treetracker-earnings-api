require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const { v4: uuid } = require('uuid');
const server = require('../../server/app');
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

    it(`Should raise validation error with error code 422 -- 'funder_id' query parameter should be a uuid  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          funder_id: 'funder_id',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'worker_id' query parameter should be a uuid  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          worker_id: 'worker_id',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'contract_id' query parameter should be a uuid  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          contract_id: 'contract_id',
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

    it(`Should raise validation error with error code 422 -- 'unknown' query parameter should not be allowed  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          unknown: 'unknown',
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

    it(`Should raise validation error with error code 422 -- 'sort_by' query parameter should be one of the defined ones  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          sort_by: 'sort_by',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'order' query parameter should be one of asc or desc  `, function (done) {
      request(server)
        .get(`/earnings`)
        .query({
          order: 'order',
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
          expect(res.body).to.have.keys(['earnings', 'links', 'totalCount']);
          expect(res.body.links).to.have.keys(['prev', 'next']);
          expect(res.body.totalCount).to.eq(6);

          // test if surveys were added successfully
          const earnings = new GenericObject(earningsOne);

          let earnings_updated = false;
          for (const earning of res.body.earnings) {
            expect(earning).to.have.keys([
                'id',
              'grower',
              'funder',
              'phone',
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

    it(`Should get earnings successfully -- with query earnings_status`, function (done) {
      request(server)
        .get(`/earnings`)
        .query({ earnings_status: 'paid' })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys(['earnings', 'links', 'totalCount']);
          expect(res.body.links).to.have.keys(['prev', 'next']);
          expect(res.body.totalCount).to.eq(2);
          return done();
        });
    });
  });

  describe('Earnings Batch Patch', () => {
    it(`Should raise validation error with error code 422 -- all rows should be valid `, function (done) {
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', './__tests__/api-tests/earningsFailedTestInvalidRow.csv')
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader.csv',
        )
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader2.csv',
        )
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader3.csv',
        )
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader4.csv',
        )
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader5.csv',
        )
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
        .attach(
          'csv',
          './__tests__/api-tests/earningsFailedTestInvalidHeader6.csv',
        )
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
          './__tests__/api-tests/earningsFailedTestRowWithNotCalculatedStatus.csv',
        )
        .expect(409)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Successful batch request`, function (done) {
        const jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6IkFkbWluIiwibGFzdE5hbWUiOiJQYW5lbCIsInBhc3N3b3JkSGFzaCI6IjQ0ZDE0MmNkMjBhMWQxZTE1YzQxOWZhOThkZTc5Y2U5OTc0MWNjNDY4NjZhYzI2MjY4N2ViNDQ2MGM0Y2NiNDIzZTdjMzU2ZDlmYzQwYjMxYWVjZmU2ODYyMzYyNjMzOWNmZmQ4YTg5YzYxYjMyOTdlY2I1YzRiZTYzZDFkMDY5Iiwic2FsdCI6IkQ4OFdDcCIsImVtYWlsIjoiYWRtaW5AZ3JlZW5zdGFuZC5vcmciLCJhY3RpdmUiOnRydWUsImNyZWF0ZWRBdCI6IjIwMjAtMDgtMDNUMTg6NDc6NDcuMjU4WiIsImVuYWJsZWQiOnRydWUsInJvbGUiOls0NiwxLDJdLCJyb2xlTmFtZXMiOlsiRWFybmluZ3MgTWFuYWdlciIsIkFkbWluIiwiVHJlZSBNYW5hZ2VyIl0sInBvbGljeSI6eyJwb2xpY2llcyI6W3sibmFtZSI6Imxpc3RfZWFybmluZ3MiLCJkZXNjcmlwdGlvbiI6IkNhbiB2aWV3IGVhcm5pbmdzIn0seyJuYW1lIjoibWFuYWdlX2Vhcm5pbmdzIiwiZGVzY3JpcHRpb24iOiJDYW4gbW9kaWZ5L2V4cG9ydCBlYXJuaW5ncyJ9LHsibmFtZSI6InN1cGVyX3Blcm1pc3Npb24iLCJkZXNjcmlwdGlvbiI6IkNhbiBkbyBhbnl0aGluZyJ9LHsibmFtZSI6Imxpc3RfdXNlciIsImRlc2NyaXB0aW9uIjoiQ2FuIHZpZXcgYWRtaW4gdXNlcnMifSx7Im5hbWUiOiJtYW5hZ2VyX3VzZXIiLCJkZXNjcmlwdGlvbiI6IkNhbiBjcmVhdGUvbW9kaWZ5IGFkbWluIHVzZXIifSx7Im5hbWUiOiJsaXN0X3RyZWUiLCJkZXNjcmlwdGlvbiI6IkNhbiB2aWV3IHRyZWVzIn0seyJuYW1lIjoiYXBwcm92ZV90cmVlIiwiZGVzY3JpcHRpb24iOiJDYW4gYXBwcm92ZS9yZWplY3QgdHJlZXMifV19LCJpYXQiOjE2NDI4NzIyNjV9.JYWYUo7B6y2jNyoaaw9uA0jTU4AYIZLXg0oGwF3XoVE'
      request(server)
        .patch(`/earnings/batch`)
        .set('Accept', 'multipart/form-data')
        .attach('csv', './__tests__/api-tests/earningsSuccessfulTest.csv')
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

  describe('Earnings BATCH GET', () => {
    const binaryParser = (res, callback) => {
      res.setEncoding('binary');
      res.data = '';
      const headers = 'earnings_id,worker_id,phone,currency,amount,status';
      let returnedHeadersEqlExpectedHeaders = false;
      res.on('data', function (chunk) {
        if (chunk === headers) returnedHeadersEqlExpectedHeaders = true;
        res.data += chunk;
      });
      res.on('end', function () {
        expect(returnedHeadersEqlExpectedHeaders).to.be.true;
        callback(null, Buffer.from(res.data, 'binary'));
      });
    };
    it(`Should get earnings successfully`, function (done) {
      request(server)
        .get(`/earnings/batch`)
        .expect('Content-Type', 'text/csv; charset=utf-8')
        .buffer()
        .parse(binaryParser)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body instanceof Buffer).to.be.true;
          return done();
        });
    });
  });
});
