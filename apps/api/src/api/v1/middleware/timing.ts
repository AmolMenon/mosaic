export function timingMiddleware(req: any, res: any, next: any) {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    req.timing = duration;
    // We could set a header here if required, or let logging handle it
  });
  
  next();
}
