const knex = require('../../server/database/knex');
const { v4: uuid } = require('uuid');

exports.seed = async () => {

  await knex("earnings").insert({
    worker_id: '4c46cdae-d15b-454e-a7e4-570c4895b3f8',
    amount: 300,
    payment_confirmation_id: uuid(),
    payment_method: 'cash',
    currency: 'USD',
    status: 'calculated',
    paid_at: new Date().toISOString(),
    contract_id: '483a1f4e-0c52-4b53-b917-5ff4311ded26',
    funder_id: 'ae7faf5d-46e2-4944-a6f9-5e65986b2e03',
    calculated_at: new Date().toISOString(),
    consolidation_rule_id: uuid(),
    consolidation_period_start: new Date().toISOString(),
    consolidation_period_end: new Date().toISOString(),
    captures_count: 10,
  });

}