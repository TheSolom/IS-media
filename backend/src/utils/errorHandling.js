export default class CustomError extends Error {
  constructor(message, statusCode, error) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode || 500;
    if (error) this.error = error;
    Error.captureStackTrace(this, this.constructor);
  }
}
