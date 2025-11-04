export interface ServerFieldError {
  field: string;
  message: string;
}

export interface ServerError {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  timestamp?: string;
  traceId?: string;
  errors?: ServerFieldError[];
}