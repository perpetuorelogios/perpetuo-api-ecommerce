import { env } from '../../env.js'
import type { LoggerPort, LogContext } from '../../application/shared/logger.js'

type LogLevel = 'info' | 'warn' | 'error'

type LogEntry = {
  level: LogLevel
  message: string
  context?: LogContext
  timestamp: string
  service: string
}

export class Logger implements LoggerPort {
  private service = 'api'

  info(message: string, context?: LogContext) {
    this.write('info', message, context)
  }

  warn(message: string, context?: LogContext) {
    this.write('warn', message, context)
  }

  error(message: string, context?: LogContext) {
    this.write('error', message, context)
  }

  private async write(level: LogLevel, message: string, context?: LogContext) {
    const entry: LogEntry = {
      level,
      message,
      ...(context !== undefined ? { context } : {}),
      timestamp: new Date().toISOString(),
      service: this.service,
    }

    console.log(JSON.stringify(entry))

    if (!env.LOGSTASH_URL) {
      return
    }

    try {
      await fetch(env.LOGSTASH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      })
    } catch {
      // Fail silently to avoid breaking request flow
    }
  }
}
