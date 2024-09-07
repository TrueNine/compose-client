import pino, {type ChildLoggerOptions} from 'pino'
import dayjs from 'dayjs'

export class Pino {
  private static __LOGGER = pino({
    timestamp: () => {
      return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
    },
    formatters: {},
    browser: {
      asObject: true,
      serialize: true,
      formatters: {
        level: label => {
          return {l: label.toUpperCase()}
        },
        log: o => {
          const _$t = o.time
          const _$l = o.l
          const _$p = o.p
          delete o.time
          delete o.l
          delete o.p
          return {_$t, _$l, _$p, ...o}
        }
      }
    }
  })
  static get instance() {
    return this.__LOGGER
  }
  static get logger() {
    return (cls: string, options?: ChildLoggerOptions<string>) => this.__LOGGER.child({p: cls}, options)
  }
}
