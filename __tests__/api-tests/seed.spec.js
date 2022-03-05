require('dotenv').config();
const { expect } = require('chai');
const knex = require('../../server/database/knex');
const seed = require('../../database/seed/index');
const log = require("loglevel");

describe.only("seed", () => {
  beforeEach(async () => {
    await knex("earnings").truncate();
  })

  it("seed", async () => {
    await seed.seed();
    const r = await knex("earnings").select();
    log.warn("r", r);
    expect(r).to.have.lengthOf(1);
  })
})