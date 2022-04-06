/*
 * Some utils for router/express
 */
const log = require('loglevel');
const { ValidationError } = require('joi');
const { isAxiosError } = require('axios').default;
const HttpError = require('./HttpError');
// const ApiKeyService = require("../services/ApiKeyService");
// const JWTService = require("../services/JWTService.js");
// const Session = require('../models/Session');

/*
 * This is from the library https://github.com/Abazhenov/express-async-handler
 * Made some customization for our project. With this, we can throw Error from
 * the handler function or internal function call stack, and parse the error,
 * send to the client with appropriate response (http error code & json body)
 *
 * USAGE: wrap the express handler with this function:
 *
 *  router.get("/xxx", handlerWrap(async (res, rep, next) => {
 *    ...
 *  }));
 *
 *  Then, add the errorHandler below to the express global error handler.
 *
 */
exports.handlerWrapper = (fn) =>
  function wrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch((e) => {
      next(e);
    });
  };

exports.errorHandler = (err, req, res, _next) => {
  if (!isAxiosError(err)) log.debug('catch error:', err);
  if (err instanceof HttpError) {
    res.status(err.code).send({
      code: err.code,
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(422).send({
      code: 422,
      message: err.details.map((m) => m.message).join(';'),
    });
  } else if (isAxiosError(err)) {
    const errorObject = {
      microserviceUrl: err.config.url,
      data: err.config.data,
      code: err.response?.data?.code || 500,
      message:
        err.response?.data?.message ||
        err.response?.error ||
        err.message ||
        `Unknown error occured with external service call`,
    };
    log.debug(errorObject);
    res.status(500).send(errorObject);
  } else {
    res.status(500).send({
      code: 500,
      message: `Unknown error (${err.message})`,
    });
  }
};

// exports.apiKeyHandler = exports.handlerWrapper(async (req, res, next) => {
//   const session = new Session();
//   const apiKey = new ApiKeyService(session);
//   await apiKey.check(req.headers['treetracker-api-key']);
//   log.debug('Valid Access');
//   next();
// });

// exports.verifyJWTHandler = exports.handlerWrapper(async (req, res, next) => {
//   const jwtService = new JWTService();
//   const decode = jwtService.verify(req.headers.authorization);
//   res.locals.wallet_id = decode.id;
//   next();
// });
