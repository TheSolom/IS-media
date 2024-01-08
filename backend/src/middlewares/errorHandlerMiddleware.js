export default function errorHandlerMiddleware(err, _req, res, next) {
  const statusCode = err.status || 500;
  const response = {
    success: false,
    message: err.message,
    error: err.error,
  };
  res.status(statusCode).json(response);
}
