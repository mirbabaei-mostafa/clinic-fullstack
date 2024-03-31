import { body } from 'express-validator';

const messageValidator = [
  body('fname').isLength({ min: 3 }).withMessage('FirstNameAtLeast3Characters'),
  body('lname').isLength({ min: 3 }).withMessage('LastNameAtLeast3Characters'),
  body('email').isEmail().withMessage('EmailFormatWrong'),
  body('phone')
    .isLength({ min: 10, max: 11 })
    .withMessage('PhoneAtLeast10Max11Characters'),
  body('title').isLength({ min: 3 }).withMessage('TitleAtLeast3Characters'),
  body('message')
    .isLength({ min: 20, max: 600 })
    .withMessage('MessageAtLeast3Max600Characters'),
];

export default messageValidator;
