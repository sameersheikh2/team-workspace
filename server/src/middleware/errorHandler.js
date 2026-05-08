function errorHanlder(err, req, res, next) {
  console.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof ValidationError) {
    return res.status(400).json({
      err: err.message,
      status: err.status,
      fields: err.fields,
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      err: err.message,
      status: err.status,
    });
  }

  if (err instanceof DatabaseError) {
    console.err("Database err:", err.originalError);
    return res.status(500).json({
      err: "Database operation failed",
      status: err.status,
    });
  }

  // Generic err for unknown err types
  console.error("Unexpected err:", err);
  res.status(500).json({
    err:
      process.env.NODE_ENV === "production"
        ? "Internal server err"
        : err.message,
  });
}
