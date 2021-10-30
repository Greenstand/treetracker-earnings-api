const BaseRepository = require('./BaseRepository');

const knex = require('../database/knex');

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
      const filterObject = { ...object };
      // remove sorting details from filterObject
      delete filterObject.orderBy;
      delete filterObject.order;
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
    if (filter.orderBy) {
      promise = promise.orderBy(filter.orderBy, filter.order);
    }

    const optionalFilterQuery = [];

    const {
      status,
      worker_id,
      funder_id,
      contract_id,
      calculated_at_end,
      calculated_at_start,
    } = filter;

    const bindings = [];

    if (status) {
      optionalFilterQuery.push(`"status" = ?`);
      bindings.push(status);
    }
    if (worker_id) {
      optionalFilterQuery.push(`"worker_id" = ?`);
      bindings.push(worker_id);
    }
    if (funder_id) {
      optionalFilterQuery.push(`"funder_id" = ?`);
      bindings.push(funder_id);
    }
    if (contract_id) {
      optionalFilterQuery.push(`"contract_id" = ?`);
      bindings.push(contract_id);
    }
    if (calculated_at_end) {
      optionalFilterQuery.push(`"calculated_at" <= ?`);
      bindings.push(calculated_at_end);
    }
    if (calculated_at_start) {
      optionalFilterQuery.push(`"calculated_at" >= ?`);
      bindings.push(calculated_at_start);
    }

    const localKnex = this._session.getDB();

    const count = await localKnex.select(
      localKnex.raw(
        `count(*) from earnings.earnings ${
          optionalFilterQuery.length > 0 ? 'where' : ''
        } ${optionalFilterQuery.join(' and ')}`,
        bindings,
      ),
    );

    return { earnings: await promise, count: +count[0].count };
  }
}

module.exports = EarningsRepository;
