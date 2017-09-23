import { tryCatch, Log } from './common';

class AutoTrade {
  @tryCatch('自动交易准备')
  check() {
    return '检查完毕';
  }
  @tryCatch('自动交易执行')
  buy() {
    throw new Error('自动交易出错！');
  }
}
describe(`装饰器模块测试`, () => {
  let autoTrade: any;
  before(() => {
    console.log('测试预处理');
    Log.init(Log.category.system, Log.level.ALL);
    autoTrade = new AutoTrade();
  });

  it('testTryCatch', () => {
    autoTrade.check();
  });
  it('testTryCatch', () => {
    autoTrade.buy();
  });

});
