import { body } from "express-validator";

const departmentValidator = [
  body("dname").isLength({ min: 3 }).withMessage("FirstNameAtLeast3Characters"),
  body("description")
    .isLength({ min: 20 })
    .withMessage("DescriptionAtLeast3Characters"),
  body("phone").isLength({ min: 10 }).withMessage("PhoneNumberAtLeast10"),
];

export default departmentValidator;
