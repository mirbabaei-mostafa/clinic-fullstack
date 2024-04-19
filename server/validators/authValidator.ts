import { body } from 'express-validator';

const authValidator = [
  body('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email address couldn't be empty or bad format!"),
  body('password').not().isEmpty().withMessage("Password couldn't be empty!"),
];

export default authValidator;
