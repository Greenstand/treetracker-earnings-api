const BaseRepository = require('./BaseRepository');
const HttpError = require('../utils/HttpError');

class EarningsRepository extends BaseRepository {
  constructor(session) {
    super('earnings', session);
    this._tableName = 'earnings';
    this._session = session;
  }

  async getEarnings(filter, { limit, offset }) {
    const whereBuilder = function (object, builder) {
      let result = builder;
      if (object.consolidation_period_start) {
        result.where(
          'consolidation_period_start',
          '>=',
          object.consolidation_period_start,
        );
        delete object.consolidation_period_start;
      }
      if (object.consolidation_period_end) {
        result.where(
          'consolidation_period_end',
          '<=',
          object.consolidation_period_end,
        );
        delete object.consolidation_period_end;
      }
      result.where(object);
    };
    return await this._session
      .getDB()(this._tableName)
      .limit(limit)
      .offset(offset)
      .where((builder) => whereBuilder(filter, builder));
  }
}

module.exports = EarningsRepository;
