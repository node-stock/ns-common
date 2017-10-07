/**
 * 日志模块
 *
 * @module common/log
 */
const log4js = require('log4js');

export enum Category {
  system = 'system',
  alert = 'alert',
  mackerelservice = 'mackerelservice',
  notify = 'notify',
  console = 'console',
}


export enum Level {
  ALL = 'ALL',
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL',
  OFF = 'OFF'
}

const LogLayout = {
  type: 'pattern',
  pattern: 'date:%d\tlevel:%p\tgroup:%c\tmessage:%m'
};

const createLogger = (categoryName: string) => {
  const logger = log4js.getLogger(categoryName);
  logger.level = 'debug';
  return logger;
};

const createConfig = (category: string, level: string) => ({
  [category]: {
    level
  }
});

/**
 * @class
 * @classdesc 日志对象
 */
export class Log {
  static category = Category;
  static level = Level;
  static system = createLogger(Category.system);
  static alert = createLogger(Category.alert);
  static mackerelservice = createLogger(Category.mackerelservice);
  static notify = createLogger(Category.notify);
  static console = createLogger(Category.console);

  static init(category: string, conLev: string, filename: string = 'ns') {
    const config = createConfig(category, conLev);
    const appenders: any = {
      'default': { type: 'console' },
      console: { type: Category.console, layout: LogLayout },
    };

    const categories: any = {
      'default': { appenders: ['default'], level: Level.ALL },
      console: { appenders: [Category.console], level: Level.ALL }
    };

    Object.keys(config).forEach((categ: Category) => {

      const level = config[categ].level;

      appenders[categ] = {
        type: 'dateFile',
        maxLogSize: 1024 * 1024 * 10,
        backups: 30,
        layout: LogLayout,
        filename: './logs/' + filename,
        alwaysIncludePattern: true,
        pattern: '-yyyy-MM-dd.log'
      };

      categories[categ] = {
        appenders: ['console', categ],
        level
      };

    });

    log4js.configure({ appenders, categories });
  }

}
