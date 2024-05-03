import { body } from 'express-validator';

const onSiteValidator = [
  body('date')
    .isLength({ min: 10, max: 10 })
    .withMessage('OnSiteDateMustBe10Characters'),
  body('starttime')
    .isLength({ min: 5, max: 5 })
    .withMessage('OnSiteStartTimeMustBe10Characters'),
  body('endtime')
    .isLength({ min: 5, max: 5 })
    .withMessage('OnSiteEndTimeMustBe10Characters'),
  body('step')
    .not()
    .isEmpty()
    .withMessage('StepMustBeDefine')
    .isInt({ min: 5, max: 120 })
    .withMessage('StepAppoinmentAtLeast5Minutes'),
];

export default onSiteValidator;
