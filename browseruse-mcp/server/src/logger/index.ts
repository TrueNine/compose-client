import pino from 'pino'

// Create a proper Logger interface that supports multiple parameters
interface ProperLogger {
  info: (msg: string, ...args: unknown[]) => void
  error: (msg: string, ...args: unknown[]) => void
  warn: (msg: string, ...args: unknown[]) => void
  debug: (msg: string, ...args: unknown[]) => void
  trace: (msg: string, ...args: unknown[]) => void
  fatal: (msg: string, ...args: unknown[]) => void
}

export const logger: ProperLogger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
}) as ProperLogger
