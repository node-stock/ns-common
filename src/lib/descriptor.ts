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
      let ret;
      try {
        ret = method.apply(target, args);
      } catch (error) {
        Log[Log.category.system].error(`(${desc}) 失败: ${name}(${args}) =>`, error);
      }
      return ret;
    }
  }
};
