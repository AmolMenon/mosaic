export const logger = {
  info: (message: string, meta: Record<string, any> = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), severity: 'INFO', message, ...meta }));
  },
  warn: (message: string, meta: Record<string, any> = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), severity: 'WARN', message, ...meta }));
  },
  error: (message: string, meta: Record<string, any> = {}) => {
    console.error(JSON.stringify({ timestamp: new Date().toISOString(), severity: 'ERROR', message, ...meta }));
  },
  debug: (message: string, meta: Record<string, any> = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify({ timestamp: new Date().toISOString(), severity: 'DEBUG', message, ...meta }));
    }
  }
};
