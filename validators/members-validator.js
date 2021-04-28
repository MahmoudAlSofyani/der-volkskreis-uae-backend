const { check } = require("express-validator");

exports.membersValidator = (methodName) => {
  switch (methodName) {
    case "addNewMember": {
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
    case "searchMember": {
      return [
        check("searchQuery")
          .exists()
          .withMessage("Search query is required")
          .notEmpty(),
      ];
    }
    case "deleteMember": {
      return [
        check("memberId")
          .exists()
          .withMessage("Member ID is required")
          .notEmpty(),
      ];
    }
    case "updateMember": {
      return [
        check("emailAddress").isEmail().withMessage("Invalid email").optional(),
        check("mobileNumber").optional(),
      ];
    }
  }
};
