const HttpError = require('../utils/HttpError');
const axios = require('axios').default;

const stakeholderUrl = `${process.env.TREETRACKER_STAKEHOLDER_API_URL}/stakeholders`;

const Earning = async ({
  id,
  worker_id,
  captures_count,
  funder_id,
  amount,
  currency,
  calculated_at,
  consolidation_rule_id,
  consolidation_period_start,
  consolidation_period_end,
  payment_confirmation_id,
  payment_method,
  payment_confirmed_by,
  payment_confirmation_method,
  payment_confirmed_at,
  paid_at,
  status,
  batch_id,
}) => {
  const consolidation_rule = `CONSOLIDATION_RULE_${consolidation_rule_id}`;
  const growerResponse = await axios.get(`${stakeholderUrl}?id=${worker_id}`);
  const funderResponse = await axios.get(`${stakeholderUrl}?id=${funder_id}`);

  return Object.freeze({
    id,
    worker_id,
    captures_count,
    grower: `${growerResponse.data.stakeholders[0]?.first_name}  ${growerResponse.data.stakeholders[0]?.last_name}`,
    funder_id,
    funder: funderResponse.data.stakeholders[0]?.org_name,
    phone: growerResponse.data.stakeholders[0]?.phone,
    amount,
    currency,
    calculated_at,
    consolidation_rule,
    consolidation_period_start,
    consolidation_period_end,
    payment_confirmation_id,
    payment_method,
    payment_confirmed_by,
    payment_confirmation_method,
    paid_at,
    payment_confirmed_at,
    status,
    batch_id,
  });
};

const BatchEarning = async ({ id, worker_id, amount, currency, status }) => {
  // Get the phone value from the entities API
  const response = await axios.get(
    `${stakeholderUrl}?stakeholder_uuid=${worker_id}`,
  );

  return Object.freeze({
    earnings_id: id,
    worker_id,
    phone: response.data.stakeholders[0]?.phone,
    currency,
    amount,
    status,
  });
};

const FilterCriteria = ({
  earnings_status = undefined,
  funder_id = undefined,
  worker_id = undefined,
  contract_id = undefined,
  start_date = undefined,
  end_date = undefined,
  sort_by = undefined,
  order = 'asc',
}) => {
  let orderBy = '';

  switch (sort_by) {
    case 'id':
      orderBy = 'id';
      break;
    case 'amount':
      orderBy = 'amount';
      break;
    case 'payment_method':
      orderBy = 'payment_method';
      break;
    case 'effective_payment_date':
      orderBy = 'calculated_at';
      break;
    default:
      orderBy = undefined;
      break;
  }
  return Object.entries({
    status: earnings_status,
    worker_id,
    funder_id,
    contract_id,
    calculated_at_end: end_date ? new Date(end_date) : end_date,
    calculated_at_start: start_date ? new Date(start_date) : start_date,
    orderBy,
    order,
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

      const queryFilterObjects = { ...filterCriteria };
      queryFilterObjects.limit = options.limit;

      // remove offset property, as it is calculated later
      delete queryFilterObjects.offset;

      const query = Object.keys(queryFilterObjects)
        .map((key) => `${key}=${encodeURIComponent(queryFilterObjects[key])}`)
        .join('&');

      const urlWithLimitAndOffset = `${url}?${query}&offset=`;

      const next = `${urlWithLimitAndOffset}${+options.offset + +options.limit}`;
      let prev = null;
      if (options.offset - +options.limit >= 0) {
        prev = `${urlWithLimitAndOffset}${+options.offset - +options.limit}`;
      }

      const { earnings, count } = await earningsRepo.getEarnings(filter, options);

      const formattedEarnings = await Promise.all(
        earnings.map((row) => {
          return Earning({ ...row });
        }),
      );

      const { sort_by, order = 'asc' } = filterCriteria;

      if (sort_by === 'grower') {
        formattedEarnings.sort((a, b) => {
          const nameA = a.grower?.toUpperCase(); // ignore upper and lowercase
          const nameB = b.grower?.toUpperCase(); // ignore upper and lowercase

          if (nameA < nameB) {
            return order === 'asc' ? -1 : 1;
          }
          if (nameA > nameB) {
            return order === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      if (filterCriteria.sort_by === 'funder') {
        formattedEarnings.sort((a, b) => {
          const nameA = a.funder?.toUpperCase(); // ignore upper and lowercase
          const nameB = b.funder?.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return order === 'asc' ? -1 : 1;
          }
          if (nameA > nameB) {
            return order === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      if (filterCriteria?.grower || filterCriteria?.phone) {
        const filterFormattedEarnings = formattedEarnings
          .filter(({ grower }) =>
            filterCriteria?.grower
              ? grower
                .toLowerCase()
                .includes(filterCriteria?.grower.toLowerCase())
              : true,
          )
          .filter(({ phone }) =>
            filterCriteria?.phone
              ? phone.toLowerCase().includes(filterCriteria?.phone.toLowerCase())
              : true,
          );

        return {
          earnings: filterFormattedEarnings,
          totalCount: filterFormattedEarnings.length,
          links: {
            prev,
            next,
          },
        };
      }

      return {
        earnings: formattedEarnings,
        totalCount: count,
        links: {
          prev,
          next,
        },
      };
    };

const updateEarnings = async (earningsRepo, requestBody) => {
  const body = { ...requestBody };
  const { worker_id, currency, amount, captures_count } = body;

  // If data is coming from csv file
  if (body.earnings_id) {
    body.id = body.earnings_id;
    delete body.earnings_id;
  }
  delete body.phone;

  const earnings = await earningsRepo.getById(body.id);

  if (earnings.status !== 'calculated')
    throw new HttpError(409, 'Earnings have either been paid or cancelled');

  if (earnings.payment_confirmation_id)
    throw new HttpError(409, 'Earnings already have a payment_confirmation_id');

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

  if (+earnings.amount !== +amount)
    throw new HttpError(
      409,
      'The amount specified does not match that of the earning',
    );

  if (+earnings.captures_count !== +captures_count) {
    console.error("earnings", earnings);
    console.error("captures_count", captures_count);
    throw new HttpError(
      409,
      'The captures_count specified does not match that of the earning',
    );
  }

  await earningsRepo.update({
    ...body,
    status: 'paid',
    payment_confirmed_at: new Date(),
  });

  return {
    status: 'completed',
    count: 1,
  };
};

const getBatchEarnings =
  (earningsRepo) =>
    async (filterCriteria = undefined) => {
      let filter = {};
      filter = FilterCriteria({
        ...filterCriteria,
      });

      const earningsStream = await earningsRepo.getEarnings(filter, {
        stream: true,
      });

      return { earningsStream };
    };

module.exports = {
  getEarnings,
  updateEarnings,
  getBatchEarnings,
  BatchEarning,
};
