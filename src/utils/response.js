// Sends a successful JSON response in the standard envelope
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

// Sends an error JSON response in the standard envelope
const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors
  });
};

module.exports = { sendSuccess, sendError };