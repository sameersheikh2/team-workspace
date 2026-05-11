class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor); //explaination below
  }
}

export class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400, "VALIDATION_ERROR");
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.resource = resource;
  }
}

export class DatabaseError extends AppError {
  constructor(message, originalError) {
    super(message, 500, "DATABASE_ERROR");
    this.originalError = originalError;
  }
}

export class AuthError extends AppError {
  constructor(message) {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, "CONFLICT_ERROR");
  }
}

/* this special line V8 features tells, start error class captureStack featurer for this object, don't include anything else so it will be cleaner and the second option to this this.contructor tells "Generate stack trace for this object,
    but ignore frames up to this constructor."
    */
