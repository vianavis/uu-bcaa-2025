const loggerFactory = require("../component/LoggerFactory");
const logLevel = require("../component/log-level");

let logger = loggerFactory.getLogger("middleware.logging-middleware")

function loggingMiddleware(req, res, next) {
  let date = new Date();
  logger.info(`${req.method} - ${req.url} - ${date.toISOString()}`)

  next();
}

module.exports = loggingMiddleware;