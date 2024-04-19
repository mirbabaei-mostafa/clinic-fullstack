import { body } from 'express-validator';

const changePasswordValidator = [
  body('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email address couldn't be empty or bad format!"),
  body('newpassword')
    .not()
    .isEmpty()
    .withMessage("Password couldn't be empty!"),
];

export default changePasswordValidator;
