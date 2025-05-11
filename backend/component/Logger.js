const logLevel = require("./log-level");

class Logger {
  constructor(name, levelName) {
    this._name = name;
    this._levelName = levelName;
    this._level = logLevel[levelName];
    if (!this._level) {
      throw new Error("Invalid level name.")
    }
  }

  debug(message, error) {
    this._log(logLevel.DEBUG, message, error)
  }

  info(message, error) {
    this._log(logLevel.INFO, message, error)
  }

  warn(message, error) {
    this._log(logLevel.WARN, message, error)
  }

  error(message, error) {
    this._log(logLevel.ERROR, message, error)
  }

  fatal(message, error) {
    this._log(logLevel.FATAL, message, error)
  }

  _log(level, message, error) {
    if (this._level <= level) {
      let logMessage = `${this._levelName} ${this._name}: ${message} ${error ? "\n " + error : ""}`
      switch (logLevel[this._levelName]) {
        case logLevel.FATAL:
        case logLevel.ERROR:
          console.error(logMessage);
          break;
        case logLevel.WARN:
        case logLevel.INFO:
        case logLevel.DEBUG:
          console.log(logMessage);
          break;
      }
    }
  }
}

module.exports = Logger;