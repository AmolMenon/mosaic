export interface ApiErrorDetails {
  [key: string]: any;
}

export interface ApiErrorResponse {
  request_id: string;
  timestamp: string;
  status: number;
  code: string;
  message: string;
  details?: ApiErrorDetails;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
    public details?: ApiErrorDetails
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
