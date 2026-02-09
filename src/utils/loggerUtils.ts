/**
 * Lightweight browser-compatible structured logger.
 * Replaces Winston to avoid Node.js module externalization in Vite builds.
 * Follows the same API surface as the boilerplate pattern.
 */

export type LogLevel = 'info' | 'error' | 'warn' | 'debug';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Default to 'info' in production, 'debug' in development.
// __DEV__ and __LOG_LEVEL__ are injected by Vite's `define` config at build time.
// In Jest, process.env is available natively.
declare const __DEV__: boolean | undefined;
declare const __LOG_LEVEL__: string | undefined;

function resolveLogLevel(): LogLevel {
  // Check Vite-injected build-time constants
  if (typeof __LOG_LEVEL__ === 'string' && __LOG_LEVEL__) return __LOG_LEVEL__ as LogLevel;
  if (typeof __DEV__ === 'boolean' && __DEV__) return 'debug';
  // Fallback to process.env (works in Jest and Node)
  try {
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.VITE_LOG_LEVEL) return process.env.VITE_LOG_LEVEL as LogLevel;
      if (process.env.NODE_ENV !== 'production') return 'debug';
    }
  } catch {
    // process not available in some environments
  }
  return 'info';
}

const currentLevel: LogLevel = resolveLogLevel();

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLevel];
}

function formatMessage(
  level: LogLevel,
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
): Record<string, unknown> {
  return {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(context && { context }),
    ...(fileName && { fileName }),
    ...(functionName && { functionName }),
    ...(payload !== undefined && { payload }),
  };
}

export function logMessage(
  level: LogLevel,
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
) {
  if (!shouldLog(level)) return;

  const entry = formatMessage(level, message, payload, context, fileName, functionName);

  switch (level) {
    case 'error':
      console.error(JSON.stringify(entry));
      break;
    case 'warn':
      console.warn(JSON.stringify(entry));
      break;
    case 'debug':
      console.debug(JSON.stringify(entry));
      break;
    case 'info':
    default:
      console.info(JSON.stringify(entry));
      break;
  }
}

export function loggerInfo(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
) {
  logMessage('info', message, payload, context, fileName, functionName);
}

export function loggerError(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
) {
  logMessage('error', message, payload, context, fileName, functionName);
}

export function loggerWarn(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
) {
  logMessage('warn', message, payload, context, fileName, functionName);
}

export function loggerDebug(
  message: string,
  payload?: unknown,
  context?: string,
  fileName?: string,
  functionName?: string,
) {
  logMessage('debug', message, payload, context, fileName, functionName);
}
