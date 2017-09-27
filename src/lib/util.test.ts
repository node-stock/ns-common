import { Util as util } from '../';
import * as assert from 'power-assert';
const moment = require('moment');

const testIsHoliday = () => {
  // 节假日
  const date1 = new Date(2017, 8, 18);
  // 非节假日
  const date2 = new Date(2017, 8, 21);

  assert.equal(true, util.isHoliday(date1));
  assert.equal(false, util.isHoliday(date2));
}

const testIsWeekend = () => {
  // 周1
  const date1 = new Date(2017, 8, 11);
  // 周2
  const date2 = new Date(2017, 8, 12);
  // 周3
  const date3 = new Date(2017, 8, 13);
  // 周4
  const date4 = new Date(2017, 8, 14);
  // 周5
  const date5 = new Date(2017, 8, 15);
  // 周6
  const date6 = new Date(2017, 8, 16);
  // 周日
  const date7 = new Date(2017, 8, 17);

  assert.equal(false, util.isWeekend(date1), '周1');
  assert.equal(false, util.isWeekend(date2), '周2');
  assert.equal(false, util.isWeekend(date3), '周3');
  assert.equal(false, util.isWeekend(date4), '周4');
  assert.equal(false, util.isWeekend(date5), '周5');
  assert.equal(true, util.isWeekend(date6), '周6');
  assert.equal(true, util.isWeekend(date7), '周7');
}

const testIsTradeDate = () => {
  // 非交易日
  const date1 = new Date(2017, 8, 18);
  // 交易日
  const date2 = new Date(2017, 8, 21);

  assert.equal(false, util.isTradeDate(date1));
  assert.equal(true, util.isTradeDate(date2));
}

const testIsTradeTime = () => {
  const isTradeTime = (date: Date, hhmm: string) => {
    if (!util.isTradeDate(date)) {
      return false;
    }
    const format = 'hh:mm',
      time = moment(hhmm, format),
      amSTime = moment('09:00', format),
      amETime = moment('11:30', format),
      pmSTime = moment('12:30', format),
      pmETime = moment('15:00', format);
    if (time.isBetween(amSTime, amETime) || time.isBetween(pmSTime, pmETime)) {
      return true;
    }
    return false;
  };
  // 非交易日
  const date1 = new Date(2017, 8, 18);
  // 交易日
  const date2 = new Date(2017, 8, 21);

  assert.equal(false, isTradeTime(date1, '10:30'), '1');
  assert.equal(false, isTradeTime(date2, '08:30'), '2');
  assert.equal(true, isTradeTime(date2, '09:30'), '3');
  assert.equal(true, isTradeTime(date2, '10:30'), '4');
  assert.equal(false, isTradeTime(date2, '11:30'), '5');
  assert.equal(false, isTradeTime(date2, '12:00'), '6');
  assert.equal(false, isTradeTime(date2, '12:30'), '7');
  assert.equal(true, isTradeTime(date2, '12:31'), '8');
  assert.equal(true, isTradeTime(date2, '14:30'), '9');
  assert.equal(false, isTradeTime(date2, '15:30'), '10');
}

const testGetNowDatetime = () => {
  console.log('获取当前日时', util.getNowDatetime());
}

const testGetNowDate = () => {
  console.log('获取当前日期', util.getNowDate());
}

const testFetch = async (done: any) => {
  const url = 'https://hesonogoma.com/stocks/data/japan-all-stock-data.json';
  const url2 = 'http://k-db.com/stocks/6553-T';
  const url3 = 'http://k-db.com/stocks/6553-T?download=csv';
  const test = await util.fetch(url);
  const res: string = await test.text();
  console.log(res.substring(0, 100));
  // const test2 = await util.fetch(url2);
  // const res2: string = await test2.text();
  // console.log(res2.substring(0, 10));
  done();
}

const testGetCsvData = async (done: any) => {
  const url = 'http://k-db.com/stocks/6553-T?download=csv';
  const res = await util.getCsvData(url);
  console.log(res[1]);
  done();
}

describe('工具模块测试', () => {

  it('判断是否为假日', testIsHoliday);
  it('判断是否为周末', testIsWeekend);
  it('判断是否为交易日', testIsTradeDate);
  it('判断是否为交易时间', testIsTradeTime);
  it('获取当前日时', testGetNowDatetime);
  it('获取当前日期', testGetNowDate);
  it('获取http(s)资源', function (done) {
    this.timeout(10000);
    testFetch(done);
  });
  it('获取csv格式数据', function (done) {
    this.timeout(10000);
    testGetCsvData(done)
  });

});
