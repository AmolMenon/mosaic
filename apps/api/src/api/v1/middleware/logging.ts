import { Request, Response, NextFunction } from 'express';

export function jsonLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = req.headers['x-request-id'] || 'system';

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      request_id: requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      latency_ms: duration,
      severity: res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO',
      message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
      // Optionally extract execution_id, pipeline_id if available on res.locals
      execution_id: res.locals.execution_id,
      provider_id: res.locals.provider_id,
      pipeline_id: res.locals.pipeline_id
    };

    console.log(JSON.stringify(logEntry));
  });

  next();
}
