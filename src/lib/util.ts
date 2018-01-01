/**
 * 共通模块
 *
 * @module common/util
 */
import { tryCatch } from './descriptor';
import * as types from 'ns-types';

const moment = require('moment');
const _ = require('lodash');
require('isomorphic-fetch');
const jpHolidays = require('japanese-holidays');
const csvjson = require('csvjson');
require('datejs');
const DateJs = <any>Date;

/**
 * @class
 * @classdesc 工具类
 */
export class Util {

  /**
   * 判断是否为假日
   * @param  {Date} date 日期
   */
  @tryCatch('判断是否为假日')
  static isHoliday(date: Date) {
    return jpHolidays.isHoliday(date) ? true : false;
  }

  /**
   * 判断是否为周末
   * @param  {Date} date 日期
	 * @return {boolean} 周末:true
   */
  @tryCatch('判断是否为周末')
  static isWeekend(date: Date) {
    return date.getDay() % 6 === 0 ? true : false;
  }

  /**
   * 判断是否为交易日
   * @param  {Date} date 日期
	 * @return {boolean} 交易日:true
   */
  @tryCatch('判断是否为交易日')
  static isTradeDate(date: Date) {
    return !this.isHoliday(date) && !this.isWeekend(date);
  }

  /**
   * 判断是否为交易时间
   * @func isTradeTime
   * @return {boolean} 现在为交易时间:true
   */
  @tryCatch('判断是否为交易时间')
  static isTradeTime() {
    if (!this.isTradeDate(new Date())) {
      return false;
    }
    const format = 'hh:mm',
      time = moment(),
      amSTime = moment('09:00', format),
      amETime = moment('11:30', format),
      pmSTime = moment('12:30', format),
      pmETime = moment('15:00', format);
    if (time.isBetween(amSTime, amETime) || time.isBetween(pmSTime, pmETime)) {
      return true;
    }
    return false;
  }

  /**
	 * 获取当前日时
	 * @func getNowDatetime
	 * @return {string} 当前日时
	 */
  @tryCatch('获取当前日时')
  static getNowDatetime() {
    const date = new DateJs().toString('yyyy-MM-dd HH:mm:ss.ms');
    return date.substr(0, date.length - 1);
  }

  /**
	 * 获取当前日期
	 * @func getNowDate
	 * @return {string} 当前日期
	 */
  @tryCatch('获取当前日期')
  static getNowDate() {
    return DateJs.today().toString('yyyy-MM-dd');
  }
  /**
	 * 获取http(s)资源
	 * @func fetch
	 * @param  {string}   url 资源url路径
	 */
  @tryCatch('获取http资源')
  static async fetch(url: string) {
    return await fetch(url);
  }
  /**
   * 获取csv格式数据
   * @func getCsvData
   * @param  {string}   url 资源url路径
   */
  static async getCsvData(url: string) {
    const response = await fetch(url);
    const res = await response.text();
    return csvjson.toArray(res);
  }

  /**
	 * 判定趋势
	 * @func getTrend
	 * @param  {array}   preData 前一条数据
	 * @param  {array}   nowData 当前数据
	 * @return {string}  [0：盘整，1：跌势，2：涨势]
	 * @example
	 * 参数数组格式：
	 * [0][1][2][3][4][5][6][7][8]
	 * [代码][日期][开盘][最高][最安][收盘][6][7][8]
	 */
  static getTrend(preData: string[], nowData: string[]) {
    let trend = '0'; // 盘整
    // 当天收盘 >= 昨天最高
    if (parseFloat(nowData[5]) >= parseFloat(preData[3])) {
      trend = '2'; // 涨势
    } else if (parseFloat(nowData[5]) <= parseFloat(preData[4])) {
      // 当天收盘 <= 昨天最低
      trend = '1'; // 跌势
    }
    return trend;
  }
  /**
   * 指定休眠时间
   * @func sleep
   * @param  {string} ms 休眠的毫秒数
   *
   * @example
   * async function demo() {
   *  console.log('Taking a break...');
   *  await util.sleep(4000);
   *  console.log('Two second later');
   *}
    * demo();
    */
  static sleep(ms: string) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /**
	 * 转换成股票对象
	 * @func toStockObj
	 * @param  {array}   arr 股票数组
	 * @return {object}  股票对象
	 * @example
	 * ['code', 'date', 'open', 'high', 'low', 'close', 'volume', 'turnover', 'trend', 'period', 'time', 'k', 'd'];
	 * arr to obj -> list.map(util.toStockObj)
	 */
  static toStockObj(arr: any[]) {
    const names: string[] = ['code', 'date', 'open', 'high', 'low', 'close', 'volume', 'turnover', 'trend', 'period', 'time', 'k', 'd'];
    return arr.reduce(function (p: any[string[number]], c: any, i: number) {
      p[names[i]] = c;
      return p;
    }, {});
  }
  /**
	 * 转换成股票数组
	 * @func toStockArr
	 * @param {array} objs 股票对象格式的数组
	 * @return  {array}   股票数组
	 * @example
	 * {a:1,b:2} ->[1,2]
	 */
  static toStockArr(objs: any[]) {
    return _.map(objs, function (val: any) {
      return val;
    });
  }
  static isEmpty(obj: any) {
    return !Object.keys(obj).length;
  }


  /**
   * 返回交易类型：[交易单位，交易类型]
   * @param symbol 商品代码
   */
  static getTradeUnit(symbol: string) {
    switch (symbol) {
      case types.Pair.BTC_JPY:
        return { amount: '0.001', type: undefined };
      case types.Pair.XRP_JPY:
        return { amount: '20', type: undefined };
      case types.Pair.LTC_BTC:
        return { amount: '0.1', type: 'btc' };
      case types.Pair.ETH_BTC:
        return { amount: '0.3', type: 'btc' };
      case types.Pair.MONA_JPY:
        return { amount: '1', type: undefined };
      case types.Pair.MONA_BTC:
        return { amount: '2', type: 'btc' };
      case types.Pair.BCC_JPY:
        return { amount: '0.01', type: undefined };
      case types.Pair.BCC_BTC:
        return { amount: '0.01', type: 'btc' };
      default:
        return { amount: '0.001', type: undefined };
    }
  }

  static getFee(symbol: string) {
    return symbol.includes('_') ? 0 : 500;
  }
}
