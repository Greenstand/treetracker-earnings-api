const jwt_decode = require('jwt-decode');
const HttpError = require('./HttpError');

const generatePrevAndNext = ({
  url,
  count,
  limitOptions: { limit, offset },
  queryObject,
}) => {
  // offset starts from 0, hence the -1
  const noOfIterations = count / limit - 1;
  const currentIteration = offset / limit;

  const queryObjectCopy = { ...queryObject };
  delete queryObjectCopy.offset;

  const query = Object.keys(queryObjectCopy)
    .map((key) => `${key}=${encodeURIComponent(queryObjectCopy[key])}`)
    .join('&');

  const urlWithLimitAndOffset = `${url}?${query}&offset=`;

  const nextUrl =
    currentIteration < noOfIterations
      ? `${urlWithLimitAndOffset}${+offset + +limit}`
      : null;
  let prev = null;
  if (offset - +limit >= 0) {
    prev = `${urlWithLimitAndOffset}${+offset - +limit}`;
  }

  return { next: nextUrl, prev };
};

const getFilterAndLimitOptions = (query) => {
  const filter = { ...query };
  const limitOptions = {};

  const defaultRange = { limit: 100, offset: 0 };
  limitOptions.limit = +filter.limit || defaultRange.limit;
  limitOptions.offset = +filter.offset || defaultRange.offset;

  delete filter.limit;
  delete filter.offset;

  return { filter, limitOptions };
};

const adminMiddleware = async (req, res, next) => {
  const authorizationHeader = req.get('authorization');
  const adminPanelUser = authorizationHeader
    ? jwt_decode(authorizationHeader)
    : null;
  const isAdmin = adminPanelUser?.roleNames.includes('Admin');

  if (!authorizationHeader || !isAdmin)
    throw new HttpError(401, 'Unauthorized!');

  req.adminId = adminPanelUser?.id;

  next();
};

module.exports = {
  generatePrevAndNext,
  getFilterAndLimitOptions,
  adminMiddleware,
};
