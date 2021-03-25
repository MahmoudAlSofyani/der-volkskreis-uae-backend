exports.generateError = (next, message, status) => {
  const error = new Error();
  error.message = message || "Internal server error occured";
  error.status = status || 500;
  next(error);
};
