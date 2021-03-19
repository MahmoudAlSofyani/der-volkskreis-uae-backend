const { check } = require("express-validator");

exports.userValidator = (methodName) => {
  switch (methodName) {
    case "addNewUser": {
      return [
        check("firstName")
          .exists()
          .withMessage("First name is required")
          .notEmpty(),
        check("lastName")
          .exists()
          .withMessage("Last name is required")
          .notEmpty(),
        check("emailAddress")
          .exists()
          .withMessage("Email address is required")
          .isEmail()
          .notEmpty(),
        check("mobileNumber")
          .exists()
          .withMessage("Mobile number is required")
          .notEmpty(),
        check("password")
          .exists()
          .withMessage("Password is required")
          .notEmpty(),
      ];
    }
  }
};
