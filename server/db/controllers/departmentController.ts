import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import ErrorHandler from '../../middlewares/errorHandler';
import departmentModel, { DepartmentSchema } from '../models/departmentModel';

// Create Department
// If request was not valid, will return Error
export const createDepatment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    return next(
      new ErrorHandler(
        validateRes
          .array()
          .map((item) => item.msg)
          .join('|'),
        400
      )
    );
  } else {
    try {
      const files: any = req.files;
      // Save new department
      const departmentData = {
        ...req.body,
        avatar:
          typeof files['avatar'] !== 'undefined'
            ? files['avatar'][0]?.path
            : '',
      };

      await departmentModel.create(departmentData);

      // Successfull save department
      return res
        .status(201)
        .json({ success: true, message: 'SuccessfullSaveDepartment' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Update Department
// If request was not valid, will return Error
export const updateDepatment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validateRes: Result<ValidationError> = validationResult(req);
  if (!validateRes.isEmpty()) {
    return next(
      new ErrorHandler(
        validateRes
          .array()
          .map((item) => item.msg)
          .join('|'),
        400
      )
    );
  } else {
    try {
      const { id } = req.params;
      const foundDepartment = departmentModel.findById(id);
      if (!foundDepartment) {
        return next(new ErrorHandler('DepartmentNotFound', 404));
      }
      const files: any = req.files;
      // Save edited department
      const departmentData = {
        ...req.body,
      };
      if (typeof files['avatar'] !== 'undefined') {
        departmentData['avatar'] = files['avatar'][0]?.path;
      }
      await departmentModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      // Successfully update department
      return res
        .status(201)
        .json({ success: true, message: 'SuccessfullUpdateDepartment' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Delete Department
// If request was not valid, will return Error
export const deleteDepatment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const foundDepartment = departmentModel.findById(id);
    if (!foundDepartment) {
      return next(new ErrorHandler('DepartmentNotFound', 404));
    }
    // delete department
    await foundDepartment.deleteOne();

    // Successfully deleted department
    return res
      .status(201)
      .json({ success: true, message: 'SuccessfullDeletedDepartment' });
  } catch (err: any) {
    // Create new department faced an error and return Error
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Get all Departments
// If request was not valid, will return Error
export const getAllDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allDepartments = await departmentModel.find();
    // Successfull fetch Departments from DB and return to frontend
    return res.status(200).json({ success: true, allDepartments });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};
