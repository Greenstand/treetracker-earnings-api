const Joi = require('joi');
const { Parser, AsyncParser } = require('json2csv');
const csv = require('csvtojson');
const fs = require('fs').promises;
const { v4: uuid } = require('uuid');
const { Readable, Transform } = require('stream');

const { BatchEarning } = require('../models/Earnings');
const { upload_csv } = require('../services/aws');
const Session = require('../models/Session');
const EarningsRepository = require('../repositories/EarningsRepository');
const {
  getEarnings,
  updateEarnings,
  getBatchEarnings,
} = require('../models/Earnings');
const HttpError = require('../utils/HttpError');

const earningsGetQuerySchema = Joi.object({
  earnings_status: Joi.string(),
  funder_id: Joi.string().uuid(),
  worker_id: Joi.string().uuid(),
  contract_id: Joi.string().uuid(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
}).unknown(false);

const earningsPatchSchema = Joi.object({
  id: Joi.string().uuid(),
  earnings_id: Joi.string().uuid(),
  worker_id: Joi.string().uuid().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  payment_confirmation_id: Joi.string().required(),
  payment_system: Joi.string().required(),
  paid_at: Joi.date().iso(),
  phone: Joi.string(),
}).xor('id', 'earnings_id');

const earningsGet = async (req, res, next) => {
  await earningsGetQuerySchema.validateAsync(req.query, { abortEarly: false });
  const session = new Session();
  const earningsRepo = new EarningsRepository(session);

  const url = `${req.protocol}://${req.get('host')}/earnings`;

  const executeGetEarnings = getEarnings(earningsRepo);
  const result = await executeGetEarnings(req.query, url);
  res.send(result);
  res.end();
};

const earningsPatch = async (req, res, next) => {
  await earningsPatchSchema.validateAsync(req.body, { abortEarly: false });
  const session = new Session();
  const earningsRepo = new EarningsRepository(session);

  try {
    await session.beginTransaction();
    const result = await updateEarnings(earningsRepo, req.body);
    await session.commitTransaction();
    res.status(200).send(result);
    res.end();
  } catch (e) {
    console.log(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

const earningsBatchGet = async (req, res, next) => {
  await earningsGetQuerySchema.validateAsync(req.query, { abortEarly: false });
  const session = new Session();
  const earningsRepo = new EarningsRepository(session);

  const executeGetBatchEarnings = getBatchEarnings(earningsRepo);
  const { earningsStream } = await executeGetBatchEarnings(req.query);
  // const input = new Readable({ objectMode: true });
  // input._read = () => {};
  // earningsStream
  //   .on('data', (row) => {
  //     console.log(row);
  //     input.push(BatchEarning({ ...row }));
  //   })
  //   .on('error', (error) => {
  //     console.log('error', error.message);
  //     throw new HttpError(500, error.message);
  //   })
  //   .on('end', () => input.push(null));
  const earningTransform = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      console.log(BatchEarning(chunk));
      this.push(BatchEarning(chunk).toString());
      callback();
    },
  });
  // const transformedReadableStream = new Readable({
  //   objectMode: true,
  //   read(size) {
  //     console.log(size);
  //     this.push(size);
  //   },
  // });

  const asyncParser = new AsyncParser({}, { objectMode: true });
  asyncParser.throughTransform(earningTransform);
  const parsingProcessor = asyncParser.fromInput(earningsStream);

  try {
    const csv = await parsingProcessor.promise();
    // parsingProcessor.throughTransform(earningTransform);
    parsingProcessor
      .on('data', (chunk) => console.log(chunk))
      .on('end', () => console.log(csv))
      .on('error', (err) => console.error(err));
    console.log(csv);
    // res.header('Content-Type', 'text/csv; charset=utf-8');
    // res.attachment('batchEarnings.csv');
    // res.send(csv);
    // res.end();
  } catch (err) {
    console.error(err);
    throw new HttpError(422, err.message);
  }
};

const earningsBatchPatch = async (req, res, next) => {
  if (req.file.mimetype !== 'text/csv')
    throw new HttpError(406, 'Only text/csv is supported');

  const key = `treetracker_earnings/${uuid()}.csv`;
  const batch_id = uuid();
  const fileBuffer = await fs.readFile(req.file.path);
  await upload_csv(fileBuffer, key);
  const session = new Session();
  const earningsRepo = new EarningsRepository(session);
  try {
    const jsonArray = await csv().fromFile(req.file.path);
    let count = 0;
    await session.beginTransaction();
    for (const row of jsonArray) {
      await earningsPatchSchema.validateAsync(row, { abortEarly: false });
      await updateEarnings(earningsRepo, { ...row, batch_id });
      count++;
    }
    // delete temp file
    await fs.unlink(req.file.path);
    await session.commitTransaction();
    res.status(200).send({
      status: 'completed',
      count,
    });
    res.end();
  } catch (e) {
    console.log(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    // delete temp file
    await fs.unlink(req.file.path);
    next(e);
  }
};

module.exports = {
  earningsGet,
  earningsPatch,
  earningsBatchGet,
  earningsBatchPatch,
};
