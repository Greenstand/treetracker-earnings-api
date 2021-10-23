const BaseRepository = require('./BaseRepository');

class BatchRepository extends BaseRepository {
  constructor(session) {
    super('earnings.batch', session);
    this._tableName = 'earnings.batch';
    this._session = session;
  }
}

module.exports = BatchRepository;
