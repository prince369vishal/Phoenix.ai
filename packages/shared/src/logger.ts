/**
 * Minimal structured logger placeholder.
 * Replace with the org-standard logging library (e.g. pino) when wiring up real services.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogFields {
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, fields?: LogFields): void {
  const entry = {
    level,
    message,
    time: new Date().toISOString(),
    ...fields,
  };
  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](JSON.stringify(entry));
}

export const logger = {
  debug: (message: string, fields?: LogFields) => log('debug', message, fields),
  info: (message: string, fields?: LogFields) => log('info', message, fields),
  warn: (message: string, fields?: LogFields) => log('warn', message, fields),
  error: (message: string, fields?: LogFields) => log('error', message, fields),
};
