import { randomUUID } from "crypto";

export function requestIdMiddleware(req: any, res: any, next: any) {
  req.id = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
}
