const { v4: uuid } = require('uuid');
const growers = require('./data/growers');
const funders = require('./data/funders');

const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const maxPayout = 12000;

exports.seed = async function (knex) {
  for (let i = 0; i < 10; i += 1) {
    const grower_id = growers.pop().id;

    const captures_count1 = randomIntFromInterval(400, 1100);

    let multiplier1 = (captures_count1 - (captures_count1 % 100)) / 10 / 100;
    if (multiplier1 > 1) {
      multiplier1 = 1;
    }
    const amount1 = multiplier1 * maxPayout;

    const captures_count2 = randomIntFromInterval(400, 1100);

    let multiplier2 = (captures_count2 - (captures_count2 % 100)) / 10 / 100;
    if (multiplier2 > 1) {
      multiplier2 = 1;
    }
    const amount2 = multiplier2 * maxPayout;

    const funder_id = funders[randomIntFromInterval(0, 2)].id;
    const consolidation_rule_id = uuid();

    await knex('earnings').insert({
      worker_id: grower_id,
      amount: amount1,
      payment_confirmation_id: null,
      payment_method: null,
      currency: 'USD',
      status: 'calculated',
      paid_at: null,
      contract_id: '483a1f4e-0c52-4b53-b917-5ff4311ded26',
      funder_id,
      calculated_at: '02/24/2022',
      consolidation_rule_id,
      consolidation_period_start: '01/25/2022',
      consolidation_period_end: '02/25/2022',
      captures_count: captures_count1,
    });

    await knex('earnings').insert({
      worker_id: grower_id,
      amount: amount2,
      payment_confirmation_id: null,
      payment_method: null,
      currency: 'USD',
      status: 'calculated',
      paid_at: null,
      contract_id: '483a1f4e-0c52-4b53-b917-5ff4311ded26',
      funder_id,
      calculated_at: '02/24/2022',
      consolidation_rule_id,
      consolidation_period_start: '02/25/2022',
      consolidation_period_end: '03/25/2022',
      captures_count: captures_count2,
    });
  }
};
