const BaseRepository = require('./BaseRepository');

class BatchRepository extends BaseRepository {
  constructor(session) {
    super('batch', session);
    this._tableName = 'batch';
    this._session = session;
  }
}

module.exports = BatchRepository;
