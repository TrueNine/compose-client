import pino, {type ChildLoggerOptions} from 'pino'
import dayjs from 'dayjs'

const _logger = pino({
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

export function logger() {
  return (cls: string, options?: ChildLoggerOptions<string>) => _logger.child({p: cls}, options)
}
