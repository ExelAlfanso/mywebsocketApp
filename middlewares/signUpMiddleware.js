import { body } from "express-validator";

const signUpMiddleware = [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("confirmEmail")
    .custom((value, { req }) => value === req.body.email)
    .withMessage("Emails do not match"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("username").notEmpty().withMessage("Username is required").trim(),
];

export default signUpMiddleware;
