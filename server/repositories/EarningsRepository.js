const BaseRepository = require('./BaseRepository');

function adjustDate(date, type) {
  if (date) {
    if (type === 'start') {
      date.setHours(0, 0, 0, 0);
    } else if (type === 'end') {
      date.setHours(23, 59, 59, 999);
    }
  }
  return date;
}

class EarningsRepository extends BaseRepository {
  constructor(session) {
    super('earnings', session);
    this._tableName = 'earnings';
    this._session = session;
  }


  // supports knex streams
  async getEarnings(filter, { limit, offset, stream }) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      const filterObject = { ...object };
      // remove sorting details from filterObject
      delete filterObject.orderBy;
      delete filterObject.order;
      if (filterObject.calculated_at_start) {
        result.where('calculated_at', '>=', adjustDate(filterObject.calculated_at_start, 'start'));
        delete filterObject.calculated_at_start;
      }
      if (filterObject.calculated_at_end) {
        result.where('calculated_at', '<=', adjustDate(filterObject.calculated_at_end, 'end'));
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
    if (filter.orderBy) {
      promise = promise.orderBy(filter.orderBy, filter.order);
    }

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where((builder) => whereBuilder(filter, builder));

    return { earnings: await promise, count: +count[0].count };
  }
}

module.exports = EarningsRepository;
