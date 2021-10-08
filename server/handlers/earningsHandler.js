const Joi = require('joi');

const Session = require('../models/Session');
const EarningsRepository = require('../repositories/EarningsRepository');
const { getEarnings, updateEarnings } = require('../models/Earnings');

const earningsGetQuerySchema = Joi.object({
  earnings_status: Joi.string(),
  organization: Joi.string(),
  planter_id: Joi.string(),
  contract_id: Joi.string(),
  start_date: Joi.date().iso(),
  end_date: Joi.date().iso(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
}).unknown(false);

const earningsPatchSchema = Joi.object({
  id: Joi.string().uuid().required(),
  worker_id: Joi.string().uuid().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  payment_confirmation_id: Joi.string().required(),
  payment_system: Joi.string().required(),
  paid_at: Joi.date().iso(),
});

const earningsGet = async (req, res, next) => {
  await earningsGetQuerySchema.validateAsync(req.query, { abortEarly: false });
  const session = new Session();
  const earningsRepo = new EarningsRepository(session);

  const url = `${req.protocol}://${req.get('host')}/message?author_handle=${
    req.query.author_handle
  }`;

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

module.exports = {
  earningsGet,
  earningsPatch,
};
