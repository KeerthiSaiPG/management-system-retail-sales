export function notFoundHandler(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  // log structured error
  const payload = {
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method,
    time: new Date().toISOString()
  };
  // for now use console.error (replace with pino/winston in production)
  console.error("APP ERROR:", JSON.stringify(payload, null, 2));

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.expose ? err.message : "Internal server error"
  });
}
