export default class CustomError extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
