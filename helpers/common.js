exports.generateError = (message, req, next) => {
  const error = new Error();
  error.message = message;
  error.status = 500;
  next(error);
};

exports.generatDefaultError = (err, req, next) => {
  const error = new Error();
  error.message = "Server error, please try again";
  error.stack = err;
  error.status = 500;
  next(error);
};
