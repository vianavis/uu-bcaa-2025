const logLevel = require("./log-level");
const Logger = require("./Logger");

const DEFAULT_LEVEL = "ERROR";

class LoggerFactory {
  constructor() {
    this._levelName = DEFAULT_LEVEL;
    this._loggers = {}
  }

  getLogger(name) {
    if (!this._loggers[name]) {
      this._loggers[name] = new Logger(name, this._levelName)
    }
    return this._loggers[name];
  }

  setLevel(levelName) {
    if (!logLevel[levelName]) {
      throw new Error("Invalid log level.")
    }
    this._levelName = levelName;
  }

}

module.exports = new LoggerFactory()