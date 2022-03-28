const BatchRepository = require('../repositories/BatchRepository');

class Batch {
  constructor(session) {
    this._batchRepository = new BatchRepository(session);
  }

  async createBatch(batchObject) {
    return this._batchRepository.create(batchObject);
  }

  async updateBatch(batchObject) {
    return this._batchRepository.update(batchObject);
  }
}

module.exports = Batch;
