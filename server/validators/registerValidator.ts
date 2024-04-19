import Users, { UserSchema } from '../db/models/userModel';
import { body } from 'express-validator';

const registerValidator = [
  body('fname')
    .isLength({ min: 2 })
    .withMessage('First name must be at least 2 characters!'),
  body('lname')
    .isLength({ min: 2 })
    .withMessage('Last name must be at least 2 characters!'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address!')
    .custom(async (value) => {
      await Users.findOne<UserSchema | undefined>({
        email: value,
      }).then((u: any) => {
        if (u) {
          return Promise.reject('Email address already exist!');
        }
      });
    }),
  body('password')
    .isLength({ min: 12 })
    .withMessage('Password must be at least 2 characters!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/
    )
    .withMessage(
      'Minimum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  body('gender')
    .isIn(['Not Known', 'Male', 'Female', 'Indeterminate'])
    .withMessage('Gender could be male, female or indeterminate!'),
  body('birth_year')
    .not()
    .isEmpty()
    .withMessage('The year of birth could not be empty!')
    .isInt({ min: 1920 })
    .withMessage('The year of birth must be greater than 1919!'),
  body('birth_month')
    .not()
    .isEmpty()
    .withMessage('The month of birth could not be empty!')
    .isInt({ min: 1, max: 12 })
    .withMessage('The month of birth must be between 1 and 12!'),
  body('birth_day')
    .not()
    .isEmpty()
    .withMessage('The day of birth could not be empty!')
    .isInt({ min: 1, max: 31 })
    .withMessage('The day of birth must be between 1 and 31!'),
];

export default registerValidator;
