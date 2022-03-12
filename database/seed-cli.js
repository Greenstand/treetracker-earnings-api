const log = require("loglevel");
const seed = require('./seed/index');
const { Command } = require('commander');
const program = new Command();

program
  .name('seed-cli')
  .description('CLI to seed data into DB for testing')
  .version('0.1.0');

program.command('earnings')
  .description('Seed an earings record into earning db')
  // .argument('<string>', 'string to split')
  .requiredOption('-f, --funder_id <string>', 'set up the funder id')
  .requiredOption('-g, --grower_id <string>', 'set up the grower id')
  .requiredOption('-c, --captures_count <string>', 'the number of captures')
  .action((options) => {
    // const limit = options.first ? 1 : undefined;
    // console.log(str.split(options.separator, limit));
    log.warn("seeding...", options);
    seed.seed(
      options.funder_id,
      options.grower_id,
      options.captures_count
    )
      .then(() => {
        process.exit(0);
      })
    log.warn("done");
  });

program.parse();