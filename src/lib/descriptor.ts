import { Log } from './common';

/**
 * trycatch装饰器
 * 异常自动输出log
 * @param  {string} desc 执行方法描述
 */
export const tryCatch = (desc: string) => {
  return (target: any, name: any, descriptor: any) => {
    const method = descriptor.value;
    descriptor.value = (...args: any[]) => {
      const errHandler = (error: any) => {
        Log[Log.category.system].error(`(${desc}) 失败: ${name}(${JSON.stringify(args)}) =>`, error);
      }
      // 判断是否为异步函数
      if (method.toString().trim().match(/awaiter/)) {
        const ret: Promise<Response> = method.apply(target, args);
        ret.catch(errHandler);
        return ret;
      } else {
        let ret;
        try {
          ret = method.apply(target, args);
        } catch (error) {
          errHandler(error);
        }
        return ret;
      }
    }
  }
};
