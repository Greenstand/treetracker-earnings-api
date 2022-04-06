const Joi = require('joi');
const { format } = require('@fast-csv/format');

const { BatchEarning } = require('../models/Earnings');
const HttpError = require('../utils/HttpError');
const EarningsService = require('../services/EarningsService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../utils/helper');

const earningsGetQuerySchema = Joi.object({
  earnings_status: Joi.string(),
  grower: Joi.string(),
  phone: Joi.string(),
  organisation_id: Joi.string(),
  funder_id: Joi.string().uuid(),
  worker_id: Joi.string().uuid(),
  contract_id: Joi.string().uuid(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
  limit: Joi.number().integer().greater(0).less(100000),
  offset: Joi.number().integer().greater(-1),
  sort_by: Joi.string().valid(
    'id',
    'grower',
    'funder',
    'amount',
    'payment_method',
    'calculated_at',
    'status',
    'paid_at',
  ),
  order: Joi.string().valid('asc', 'desc'),
  sub_organization: Joi.string().uuid(),
}).unknown(false);

const earningsPatchSchema = Joi.object({
  id: Joi.string().uuid(),
  earnings_id: Joi.string().uuid(),
  worker_id: Joi.string().uuid().required(),
  amount: Joi.number().required(),
  captures_count: Joi.number().required(),
  currency: Joi.string().required(),
  payment_confirmation_id: Joi.string().required(),
  payment_method: Joi.string().required(),
  paid_at: Joi.date().iso(),
  phone: Joi.string(),
}).xor('id', 'earnings_id');

const earningsGet = async (req, res) => {
  await earningsGetQuerySchema.validateAsync(req.query, { abortEarly: false });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);

  const earningsService = new EarningsService();
  const { earnings, count } = await earningsService.getEarnings(
    filter,
    limitOptions,
  );

  const url = `earnings`;
  const links = generatePrevAndNext({
    url,
    count,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    earnings,
    links,
    query: { count, ...limitOptions, ...filter },
  });

  res.end();
};

const earningsPatch = async (req, res) => {
  await earningsPatchSchema.validateAsync(req.body, { abortEarly: false });
  const earningsService = new EarningsService();

  await earningsService.updateEarnings({
    payment_confirmation_method: 'single',
    payment_confirmed_by: req.adminId,
    ...req.body,
  });

  res.send({ status: 'completed', count: 1 });
};

const earningsBatchGet = async (req, res) => {
  await earningsGetQuerySchema.validateAsync(req.query, { abortEarly: false });
  const earningsService = new EarningsService();

  const earningsStream = await earningsService.getBatchEarnings(req.query);
  const csvStream = format({ headers: true });

  earningsStream
    .on('data', function (row) {
      this.pause();
      BatchEarning({ ...row }).then((r) => {
        csvStream.write(r);
        this.resume();
      });
    })
    .on('end', () => {
      csvStream.end();
    });

  res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename=batchEarnings.csv',
  });
  csvStream.pipe(res).on('end', () => {});
};

const earningsBatchPatch = async (req, res) => {
  if (req.file.mimetype !== 'text/csv')
    throw new HttpError(406, 'Only text/csv is supported');

  const validateRow = async (row) => {
    await earningsPatchSchema.validateAsync(row, {
      abortEarly: false,
    });
  };

  const earningsService = new EarningsService();

  const result = await earningsService.updateBatchEarnings(
    req.file,
    validateRow,
    req.adminId,
  );

  res.send(result);
};

module.exports = {
  earningsGet,
  earningsPatch,
  earningsBatchGet,
  earningsBatchPatch,
};
