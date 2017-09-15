import { Scheduler, Log } from '../';
import * as assert from 'power-assert';

let i = 0;
const testInvok = (done: any) => {
  const scheduler = new Scheduler('* * * * * *');
  scheduler.invok(() => {
    i++;
    Log.console.info('scheduler.invok', i);
    if (i > 2) {
      scheduler.reminder.cancel();
      assert.ok(true);
      done();
    }
  });
}


describe('定时任务测试', () => {

  it('测试是否执行定时任务', testInvok);

});
