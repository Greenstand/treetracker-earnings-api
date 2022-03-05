const seed = require('./seed/index');
const log = require("loglevel");

log.warn("seeding...");
seed.seed()
  .then(() => {
    process.exit(0);
  })
log.warn("done");