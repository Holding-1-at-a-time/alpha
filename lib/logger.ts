type LogLevel = "info" | "warn" | "error"

interface LogOptions {
  tenant?: string
  user?: string
  [key: string]: any
}

class Logger {
  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString()
    const optionsStr = options ? ` ${JSON.stringify(options)}` : ""
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${optionsStr}`
  }

  info(message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage("info", message, options)
    console.log(formattedMessage)
    this.sendToObservability("info", message, options)
  }

  warn(message: string, options?: LogOptions): void {
    const formattedMessage = this.formatMessage("warn", message, options)
    console.warn(formattedMessage)
    this.sendToObservability("warn", message, options)
  }

  error(message: string, error?: Error, options?: LogOptions): void {
    const errorDetails = error ? ` - ${error.message}\n${error.stack}` : ""
    const formattedMessage = this.formatMessage("error", `${message}${errorDetails}`, options)
    console.error(formattedMessage)
    this.sendToObservability("error", message, { ...options, error: error?.message, stack: error?.stack })
  }

  private sendToObservability(level: LogLevel, message: string, options?: LogOptions): void {
    // Placeholder for future integration with Sentry, DataDog, etc.
    // if (process.env.NODE_ENV === 'production') {
    //   // Send to Sentry, DataDog, etc.
    // }
  }
}

export const logger = new Logger()
