/**
 * 定时任务执行模块
 *
 * @module common/schedule
 */
const schedule = require('node-schedule');
/**
 * @class
 * @classdesc Cron表达式定时器
 *
 * @param {string=}[cron='30 15 * * *'] Cron表达式<br/>
 **    *    *    *    *    *<br/>
 *┬    ┬    ┬    ┬    ┬    ┬<br/>
 *│    │    │    │    │    └ 星期 (0 - 7) (0 or 7 为星期日)<br/>
 *│    │    │    │    └───── 月 (1 - 12)<br/>
 *│    │    │    └────────── 天 (1 - 31)<br/>
 *│    │    └─────────────── 小时 (0 - 23)<br/>
 *│    └──────────────────── 分钟 (0 - 59)<br/>
 *└───────────────────────── 秒 (0 - 59, 可选)
 */
export class Scheduler {
  cron: any;
  // 任务记录对象
  reminder: any;

  constructor(cron: any) {
    this.cron = cron || '30 15 * * *';
  }

  /**
	 * 执行任务计划
	 * @param  {Function} fn 具体执行的处理方法
	 */
  invok(fn: any) {
    if (!fn) {
      return;
    }
    this.reminder = schedule.scheduleJob(this.cron, () => {
      fn();
    })
  }
}
