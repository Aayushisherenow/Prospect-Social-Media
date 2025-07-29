class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(data, message = "Success") {
    return this.res.status(200).json({
      status: "success",
      data,
      message, 
    });
  }

  error(message = "Error", statusCode = 500) {
    return this.res.status(statusCode).json({
      status: "error",
      message,
    });
  }
}

export default ApiResponse;