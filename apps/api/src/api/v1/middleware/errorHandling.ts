import { ApiException, ApiErrorResponse } from "../schemas/errors/errors";

export function errorHandlingMiddleware(err: any, req: any, res: any, next: any) {
  const isApiException = err instanceof ApiException;
  
  const status = isApiException ? err.status : 500;
  const code = isApiException ? err.code : 'INTERNAL_SERVER_ERROR';
  const message = isApiException ? err.message : 'An unexpected error occurred.';
  const details = isApiException ? err.details : undefined;

  const response: ApiErrorResponse = {
    request_id: req.id || 'unknown',
    timestamp: new Date().toISOString(),
    status,
    code,
    message,
    details
  };

  // Prevent double sending
  if (!res.headersSent) {
    res.status(status).json(response);
  }
}
