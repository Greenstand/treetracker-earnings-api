const BaseRepository = require('./BaseRepository');

class EarningsRepository extends BaseRepository {
  constructor(session) {
    super('earnings.earnings', session);
    this._tableName = 'earnings.earnings';
    this._session = session;
  }

  // supports knex streams
  async getEarnings(filter, { limit, offset, stream }) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      const filterObject = object;
      if (filterObject.calculated_at_start) {
        result.where('calculated_at', '>=', filterObject.calculated_at_start);
        delete filterObject.calculated_at_start;
      }
      if (filterObject.calculated_at_end) {
        result.where('calculated_at', '<=', filterObject.calculated_at_end);
        delete filterObject.calculated_at_end;
      }
      result.where(filterObject);
    };
    let promise = this._session
      .getDB()(this._tableName)
      .where((builder) => whereBuilder(filter, builder));
    if (stream) {
      return promise.stream();
    }
    if (limit) {
      promise = promise.limit(limit);
    }
    if (offset) {
      promise = promise.offset(offset);
    }

    return promise;
  }
}

module.exports = EarningsRepository;
