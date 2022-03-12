require('dotenv').config();
const { expect } = require('chai');
const knex = require('../../server/database/knex');
const seed = require('../../database/seed/index');
const log = require("loglevel");

describe("seed", () => {
  beforeEach(async () => {
    await knex("earnings").truncate();
  })

  it.only("seed", async () => {
    await seed.seed(
      '4c46cdae-d15b-454e-a7e4-570c4895b3f8',
      'ae7faf5d-46e2-4944-a6f9-5e65986b2e03',
      10
    );
    const r = await knex("earnings").select();
    log.warn("r", r);
    expect(r).to.have.lengthOf(1);
  })
})