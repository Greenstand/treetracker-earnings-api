const knex = require('../../server/database/knex');
const { v4: uuid } = require('uuid');

exports.seed = async (
  funder_id,
  worker_id,
  captures_count,
  sub_organization,
) => {

  let multiplier = (captures_count - captures_count % 100) / 10 / 100;
  if (multiplier > 1) {
    multiplier = 1
  }
  console.warn("multiplier:", multiplier)
  const maxPayout = 1200000
  const amount = multiplier * maxPayout
  await knex("earnings").insert({
    worker_id,
    amount,
    payment_confirmation_id: null,
    payment_method: null,
    currency: 'SLL',
    status: 'calculated',
    paid_at: null,
    contract_id: '483a1f4e-0c52-4b53-b917-5ff4311ded26',
    funder_id,
    calculated_at: new Date().toISOString(),
    consolidation_rule_id: uuid(),
    consolidation_period_start: new Date().toISOString(),
    consolidation_period_end: new Date().toISOString(),
    captures_count,
    sub_organization,
  });

}