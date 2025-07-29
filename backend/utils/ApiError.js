class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.message = message || "Something went wrong";
    this.stack = Error.captureStackTrace(this, this.constructor);
    
  }
} 

export default ApiError;