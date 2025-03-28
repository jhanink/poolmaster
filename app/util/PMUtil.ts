export enum PM_LOG_LEVEL {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export const PMUtil = {
  // --- STORAGE END ---
  logLevel: PM_LOG_LEVEL.INFO,
  setLogLevel: (logLevel: PM_LOG_LEVEL) => {
    PMUtil.logLevel = logLevel;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (...args: any[]) => {
    console[PMUtil.logLevel](`%c [ ${PMUtil.logLevel.toUpperCase()} ]`, `color: cyan`, ...args)
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  devDebug: (...args: any[]) => {
    console.debug('%c [ DEV - DEBUG ] ', 'color: yellow', ...args);
  },
}
