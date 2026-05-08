import {
  AuthError,
  AuthorizationError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../utils/globalError.js";

export function errorHandler(err, req, res, next) {
  console.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      fields: err.fields,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof DatabaseError) {
    console.error("Database error:", err.originalError);

    return res.status(err.statusCode).json({
      error: "Database operation failed",
      code: err.code,
    });
  }

  if (err instanceof AuthError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  if (err instanceof AuthorizationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Unknown/unexpected errors
  console.error("Unexpected error:", err);

  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}

export function successResponse(
  res,
  data = null,
  message = "Success",
  statusCode = 200,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}
