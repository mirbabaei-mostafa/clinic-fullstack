import { body } from 'express-validator';

const findUserValidator = [
  body('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email address couldn't be empty or bad format!"),
];

export default findUserValidator;
