const { v4: uuid } = require('uuid');
const sinon = require('sinon');
const knex = require('../../server/database/knex');
const s3 = require('../../server/services/s3');
const axios = require('axios').default;

const workerId = '71be6266-81fe-476f-a563-9bc1c61fc037';
const earningsPaymentObject = {
  worker_id: workerId,
  amount: 700,
  captures_count: 22,
  payment_confirmation_id: uuid(),
  payment_method: 'cash',
  currency: 'USD',
  status: 'calculated',
  paid_at: new Date().toISOString(),
};
const earningsOne = {
  ...earningsPaymentObject,
  payment_method: 'bike',
  id: '915b1c8c-e1d0-44f8-a6a7-7026e2a8f04b',
};
const earningsTwo = {
  ...earningsPaymentObject,
  id: 'f3056760-4c36-4cf7-b625-ed656d314794',
};
const earningsThree = {
  ...earningsPaymentObject,
  id: 'a69e5cec-945f-4693-8a94-01623ee44187',
};
const earningsFour = {
  ...earningsPaymentObject,
  id: '61714d24-6131-4296-ae36-30a7199cc645',
};
const earningsWithPaidStatus = {
  ...earningsPaymentObject,
  id: '9c10e443-4e08-40d4-9b73-5a931886f896',
  status: 'paid',
};
const earningsWithCancelledStatus = {
  ...earningsPaymentObject,
  id: '3ab96dfd-274a-4097-8e7d-942e58203784',
  status: 'cancelled',
};
let stub;
let axiosStub;

before(async () => {
  stub = sinon.stub(s3, 'upload').returns({
    promise: () => {
      return { Location: 'https://location.com' };
    },
  });

  axiosStub = sinon.stub(axios, 'get').resolves({
    data: { stakeholders: [{ phone: '344412585', name: 'name' }] },
  });

  // prettier-ignore
  await knex.raw(`

    INSERT INTO earnings(
      id, worker_id, funder_id, amount, captures_count, currency, calculated_at, consolidation_rule_id, consolidation_period_start, consolidation_period_end, payment_confirmed_by, payment_confirmation_method, status, active, contract_id)
	    VALUES 
        ('${earningsOne.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}', '${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'single', '${earningsOne.status}', true, '${uuid()}'),
        ('${earningsTwo.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}','${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'single', '${earningsTwo.status}', true, '${uuid()}'),
        ('${earningsThree.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}','${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'single', '${earningsThree.status}', true, '${uuid()}'),
        ('${earningsFour.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}','${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'batch', '${earningsFour.status}', true, '${uuid()}'),
        ('${earningsWithCancelledStatus.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}','${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'single', '${earningsWithCancelledStatus.status}', true, '${uuid()}'),
        ('${earningsWithPaidStatus.id}','${workerId}', '${uuid()}', '${earningsPaymentObject.amount}','${earningsPaymentObject.captures_count}', '${earningsPaymentObject.currency}', now(), '${uuid()}', now(), now(), 1,'single', '${earningsWithPaidStatus.status}', true, '${uuid()}');
  `);
});

after(async () => {
  stub.restore();
  axiosStub.restore();
  await knex.raw(`

    DELETE FROM earnings
    WHERE worker_id = '${workerId}';
  `);
});

// should not be in the PATCH request body
const { status, ...earnings } = earningsOne;
const { status: status2, ...earningsPaid } = earningsWithPaidStatus;
const { status: status3, ...earningsCancelled } = earningsWithCancelledStatus;

module.exports = {
  earnings,
  earningsPaid,
  earningsCancelled,
};
