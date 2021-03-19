const { validationResult } = require("express-validator");

const processValidations = (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({
      errors: validationErrors,
    });
  } else {
    next();
  }
};

module.exports = processValidations;
