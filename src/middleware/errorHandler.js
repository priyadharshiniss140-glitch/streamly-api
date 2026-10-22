// errorHandler.js
// Centralised mapping from Mongoose errors to HTTP responses.

export function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }
    return res.status(400).json({ error: "ValidationError", fields });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "CastError",
      message: "Invalid ID format",
      field: err.path,
    });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      error: "DuplicateKey",
      message: field + " already exists",
      field,
    });
  }

  // Unknown errors are logged server-side; details are hidden from clients.
  console.error(err);
  res.status(500).json({ error: "InternalServerError" });
}
