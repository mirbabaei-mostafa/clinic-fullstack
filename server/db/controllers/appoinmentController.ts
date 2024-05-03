import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import ErrorHandler from '../../middlewares/errorHandler';
import appoinmentModel, { AppoinmentSchema } from '../models/appoinmentModel';
import userModel, { UserSchema } from '../models/userModel';
import departmentModel, { DepartmentSchema } from '../models/departmentModel';

// Create on site record
export const createAppoinment = async (
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
      const {
        doctorId,
        departmentId,
        fname,
        lname,
        email,
        gender,
        nid,
        insuranceid,
        phone,
        mobile,
        address,
        birth_year,
      } = req.body;
      // Control, that doctor exist
      const foundDoctor = await userModel.findById(doctorId);
      if (!foundDoctor) {
        return next(new ErrorHandler('DoctorNotFound', 400));
      }
      // Control, that department exist
      const foundDepartment = await departmentModel.findById(departmentId);
      if (!foundDepartment) {
        return next(new ErrorHandler('DepartmentNotFound', 400));
      }
      await appoinmentModel.create({
        doctorId: doctorId,
        departmentId: departmentId,
        fname: fname,
        lname: lname,
        email: email,
        gender: gender,
        nid: nid,
        insuranceid: insuranceid,
        phone: phone,
        mobile: mobile,
        address: address,
        birth_year: birth_year,
        status: 'Pending',
      });

      // Successfull save Appoinment record
      return res
        .status(201)
        .json({ success: true, message: 'SuccessfullSaveAppoinment' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Update Appoinment
// If request was not valid, will return Error
export const updateAppoinment = async (
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
      const foundAppoinment = appoinmentModel.findById(id);
      if (!foundAppoinment) {
        return next(new ErrorHandler('AppoinmentNotFound', 404));
      }

      // Save edited Appoinment
      const appoinmentData = {
        ...req.body,
      };
      await departmentModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      // Successfully update department
      return res
        .status(201)
        .json({ success: true, message: 'SuccessfullUpdateAppoinment' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Delete Appoinment
// If request was not valid, will return Error
export const deleteAppoinment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const foundAppoinment = appoinmentModel.findById(id);
    if (!foundAppoinment) {
      return next(new ErrorHandler('AppoinmentNotFound', 404));
    }
    // delete Appoinment
    await foundAppoinment.deleteOne();

    // Successfully deleted Appoinment
    return res
      .status(201)
      .json({ success: true, message: 'SuccessfullDeletedAppoinment' });
  } catch (err: any) {
    // Create new Appoinment faced an error and return Error
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Get all Appoinment
// If request was not valid, will return Error
export const getAllAppoinment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allAppoinment = await appoinmentModel.find();
    // Successfull fetch Appoinment from DB and return to frontend
    return res.status(200).json({ success: true, allAppoinment });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};
