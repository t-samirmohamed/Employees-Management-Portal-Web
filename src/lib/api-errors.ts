export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export class ValidationApiError extends ApiError {
  errors: Record<string, string[]>;

  constructor(message: string, status: number, errors: Record<string, string[]>) {
    super(message, status);
    this.name = "ValidationApiError";
    this.errors = errors;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";
