import { Log } from '../';

const CATEGORY = 'system';

const testWithoutConfig = () => {

  Log[CATEGORY].trace(`this is trace without config`);
  Log[CATEGORY].debug(`this is debug without config`);
  Log[CATEGORY].info(`this is info witShout config`);
  Log[CATEGORY].warn(`this is warn without config`);
  Log[CATEGORY].error(`this is error without config`);
  Log[CATEGORY].fatal(`this is fatal without config`);

  console.log(`--------`);

  Log.init(Log.category.system, Log.level.ALL);
  Log[CATEGORY].trace(`this is trace with empty config`);
  Log[CATEGORY].debug(`this is debug with empty config`);
  Log[CATEGORY].info(`this is info with empty config`);
  Log[CATEGORY].warn(`this is warn with empty config`);
  Log[CATEGORY].error(`this is error with empty config`);
  Log[CATEGORY].fatal(`this is fatal with empty config`);

};

describe(`日志模块测试#${CATEGORY}`, () => {

  it('should output log', testWithoutConfig);

});
