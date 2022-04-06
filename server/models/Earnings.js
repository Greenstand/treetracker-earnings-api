const log = require('loglevel');
const EarningsRepository = require('../repositories/EarningsRepository');
const HttpError = require('../utils/HttpError');
const { getStakeholderById } = require('../services/StakeholderService');

class Earnings {
  constructor(session) {
    this._earningsRepository = new EarningsRepository(session);
  }

  static FilterCriteria({
    earnings_status = undefined,
    funder_id = undefined,
    worker_id = undefined,
    contract_id = undefined,
    start_date = undefined,
    end_date = undefined,
    sort_by = undefined,
    order = 'asc',
    sub_organization = undefined,
  }) {
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
      case 'calculated_at':
        orderBy = 'calculated_at';
        break;
      case 'paid_at':
        orderBy = 'paid_at';
        break;
      default:
        orderBy = undefined;
        break;
    }
    return Object.entries({
      status: earnings_status,
      worker_id,
      funder_id,
      sub_organization,
      contract_id,
      calculated_at_end: end_date ? new Date(end_date) : end_date,
      calculated_at_start: start_date ? new Date(start_date) : start_date,
      orderBy,
      order,
    })
      .filter((entry) => entry[1] !== undefined)
      .reduce((result, item) => {
        const resultCopy = { ...result };
        const [key, value] = item;
        resultCopy[key] = value;
        return resultCopy;
      }, {});
  }

  static async Earning({
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
    sub_organization,
  }) {
    const consolidation_rule = `CONSOLIDATION_RULE_${consolidation_rule_id}`;
    const growerResponse = await getStakeholderById(worker_id);
    const funderResponse = await getStakeholderById(funder_id);

    let subOrganizationResponse;
    if (sub_organization) {
      subOrganizationResponse = await getStakeholderById(sub_organization);
    }

    return Object.freeze({
      id,
      worker_id,
      captures_count,
      grower: `${growerResponse?.first_name} ${growerResponse?.last_name}`,
      funder_id,
      funder: funderResponse?.org_name,
      phone: growerResponse?.phone,
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
      sub_organization,
      sub_organization_name: subOrganizationResponse?.org_name,
    });
  }

  static async BatchEarning({ id, worker_id, amount, currency, status }) {
    // Get the phone value from the entities API
    const response = await getStakeholderById(worker_id);

    return Object.freeze({
      earnings_id: id,
      worker_id,
      phone: response?.phone,
      currency,
      amount,
      status,
    });
  }

  async _response(earning) {
    return this.constructor.Earning(earning);
  }

  async getEarnings(filter, limitOptions) {
    const filterCriteria = this.constructor.FilterCriteria({ ...filter });
    const sortBy = filter.sort_by;
    const { order } = filter;
    const { earnings, count } = await this._earningsRepository.getEarnings(
      filterCriteria,
      limitOptions,
    );

    let formattedEarnings = await Promise.all(
      earnings.map((row) => {
        return this._response({ ...row });
      }),
    );

    const initialLength = formattedEarnings.length;

    if (sortBy === 'grower') {
      formattedEarnings.sort((a, b) => {
        const nameA = a.grower?.toUpperCase() || ""; // ignore upper and lowercase
        const nameB = b.grower?.toUpperCase() || "";  // ignore upper and lowercase

        if (nameA < nameB) {
          return order === 'asc' ? -1 : 1;
        }
        if (nameA > nameB) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    if (sortBy === 'funder') {
      formattedEarnings.sort((a, b) => {
        const nameA = a.funder?.toUpperCase() || ""; // ignore upper and lowercase
        const nameB = b.funder?.toUpperCase() || ""; // ignore upper and lowercase
        if (nameA < nameB) {
          return order === 'asc' ? -1 : 1;
        }
        if (nameA > nameB) {
          return order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    if (filter?.grower) {
      formattedEarnings = formattedEarnings.filter(({ grower }) =>
        grower.toLowerCase().includes(filter?.grower.toLowerCase()),
      );
    }

    if (filter?.phone) {
      formattedEarnings = formattedEarnings.filter(({ phone }) =>
        phone.toLowerCase().includes(filter?.phone.toLowerCase()),
      );
    }

    // after grower and phone filters have been applied
    const newLength = formattedEarnings.length;

    // get the number of items removed and subtract from total count
    const noOfItemsRemoved = initialLength - newLength;

    return { earnings: formattedEarnings, count: count - noOfItemsRemoved };
  }

  async getBatchEarnings(filter = {}) {
    const filterCriteria = this.constructor.FilterCriteria({
      ...filter,
    });

    const earningsStream = await this._earningsRepository.getEarnings(
      filterCriteria,
      { stream: true },
    );

    return earningsStream;
  }

  async updateEarnings(requestBody) {
    const body = { ...requestBody };
    const { worker_id, currency, amount, captures_count } = body;

    // If data is coming from csv file
    if (body.earnings_id) {
      body.id = body.earnings_id;
      delete body.earnings_id;
    }
    delete body.phone;

    const earnings = await this._earningsRepository.getById(body.id);

    if (earnings.status !== 'calculated')
      throw new HttpError(
        409,
        'There are some earning records in this file have been paid or canceled',
      );

    if (earnings.payment_confirmation_id)
      throw new HttpError(
        409,
        'Earnings already have a payment_confirmation_id',
      );

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
      log.debug('earnings', earnings);
      log.debug('captures_count', captures_count);
      throw new HttpError(
        409,
        'The captures_count specified does not match that of the earning',
      );
    }

    await this._earningsRepository.update({
      ...body,
      status: 'paid',
      payment_confirmed_at: new Date(),
    });
  }
}

module.exports = Earnings;
