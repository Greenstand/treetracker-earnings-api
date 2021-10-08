const HttpError = require('../utils/HttpError');

const Earning = ({
  worker_id,
  funder_id,
  amount,
  currency,
  calculated_at,
  consolidation_period_start,
  consolidation_period_end,
  payment_confirmation_id,
  payment_system,
  payment_confirmed_by,
  payment_confirmation_method,
  paid_at,
  status,
  batch_id,
}) =>
  Object.freeze({
    worker_id,
    funder_id,
    amount,
    currency,
    calculated_at,
    consolidation_rule: 'undefined',
    consolidation_period_start,
    consolidation_period_end,
    payment_confirmation_id,
    payment_system,
    payment_confirmed_by,
    payment_confirmation_method,
    paid_at,
    payment_confirmed_at: 'undefinedd',
    status,
    batch_id,
  });

const FilterCriteria = ({
  earnings_status = undefined,
  organization = undefined,
  planter_id = undefined,
  contract_id = undefined,
  start_date = undefined,
  end_date = undefined,
}) => {
  return Object.entries({
    status: earnings_status,
    worker_id: planter_id, //confirm this
    consolidation_period_end: end_date ? new Date(end_date) : end_date,
    consolidation_period_start: start_date ? new Date(start_date) : start_date,
  })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const QueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const getEarnings =
  (earningsRepo) =>
  async (filterCriteria = undefined, url) => {
    let filter = {};
    let options = { limit: 100, offset: 0 };
    filter = FilterCriteria({
      ...filterCriteria,
    });
    options = { ...options, ...QueryOptions({ ...filterCriteria }) };

    const urlWithLimitAndOffset = `${url}&limit=${options.limit}&offset=`;

    const next = `${urlWithLimitAndOffset}${+options.offset + 1}`;
    let prev = null;
    if (options.offset - 1 >= 0) {
      prev = `${urlWithLimitAndOffset}${+options.offset - 1}`;
    }

    const earnings = await earningsRepo.getEarnings(filter, options);
    return {
      earnings: earnings.map((row) => {
        return Earning({ ...row });
      }),
      links: {
        prev,
        next,
      },
    };
  };

const updateEarnings = async (earningsRepo, requestBody) => {
  const { worker_id, currency, amount } = requestBody;
  const earnings = await earningsRepo.getById(requestBody.id);

  if (earnings.status !== 'calculated')
    throw new HttpError(409, 'Earnings have either been paid or cancelled');

  if (earnings.worker_id !== worker_id)
    throw new HttpError(
      409,
      'The worker id specified does not match that of the earning',
    );

  if (earnings.currency !== currency)
    throw new HttpError(
      409,
      'The currency specified does not match that of the earning',
    );

  if (+earnings.amount !== amount)
    throw new HttpError(
      409,
      'The amount specified does not match that of the earning',
    );

  await earningsRepo.update(requestBody);

  return {
    status: 'completed',
    count: 1,
  };
};

module.exports = {
  getEarnings,
  updateEarnings,
};
