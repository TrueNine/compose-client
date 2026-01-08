import process from 'node:process'
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

// Determine if we're in development mode
const isDevelopment = process.env.NODE_ENV !== 'production'

// Create logger configuration based on environment
const loggerConfig: pino.LoggerOptions = isDevelopment
  ? {
      level: process.env.LOG_LEVEL ?? 'debug',
      formatters: {
        level: (label: string) => ({level: label.toUpperCase()}),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Development: Human-readable format without external dependencies
      // Note: prettyPrint option removed as it's deprecated in pino v8+
    }
  : {
      level: process.env.LOG_LEVEL !== null && process.env.LOG_LEVEL !== void 0 && process.env.LOG_LEVEL !== '' ? process.env.LOG_LEVEL : 'info',
      formatters: {
        level: (label: string) => ({level: label.toUpperCase()}),
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      // Production: JSON format for log aggregation
    }

export const logger: ProperLogger = pino(loggerConfig) as ProperLogger
