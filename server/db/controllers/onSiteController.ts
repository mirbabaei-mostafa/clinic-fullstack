import { NextFunction, Request, Response } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';
import ErrorHandler from '../../middlewares/errorHandler';
import onSiteModel, { OnSiteSchema } from '../models/onSiteModel';
import timelineMode from '../models/timelineModel';
import userModel, { UserSchema } from '../models/userModel';
import departmentModel, { DepartmentSchema } from '../models/departmentModel';
import { getUserId } from '../../utils/users';

// Create on site record
export const createOnSite = async (
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
      const { doctorId, departmentId, date, starttime, endtime, step } =
        req.body;
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
      await onSiteModel.create({
        doctorId: doctorId,
        departmentId: departmentId,
        date: date,
        starttime: starttime,
        endtime: endtime,
        step: step,
        isactive: false,
      });

      // Successfull save OnSite record
      return res
        .status(201)
        .json({ success: true, message: 'SuccessfullSaveOnSite' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Update OnSite
// If request was not valid, will return Error
export const updateOnSite = async (
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
      const foundOnSite = onSiteModel.findById(id);
      if (!foundOnSite) {
        return next(new ErrorHandler('OnSiteNotFound', 404));
      }

      // Save edited OnSite
      const onSiteData = {
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
        .json({ success: true, message: 'SuccessfullUpdateOnSite' });
    } catch (err: any) {
      // Create new department faced an error and return Error
      return next(new ErrorHandler(err.message || 'InternalServerError', 500));
    }
  }
};

// Delete OnSite
// If request was not valid, will return Error
export const deleteOnSite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const foundOnSite = onSiteModel.findById(id);
    if (!foundOnSite) {
      return next(new ErrorHandler('OnSiteNotFound', 404));
    }
    // delete onsite
    await foundOnSite.deleteOne();

    // Successfully deleted onsite
    return res
      .status(201)
      .json({ success: true, message: 'SuccessfullDeletedOnSite' });
  } catch (err: any) {
    // Create new onsite faced an error and return Error
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Get all OnSite
// If request was not valid, will return Error
export const getAllOnSite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allOnSite = await onSiteModel.find();
    // Successfull fetch OnSite from DB and return to frontend
    return res.status(200).json({ success: true, allOnSite });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Active a OnSite times
export const activeOnsite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const foundOnSite = onSiteModel.findById(id);
    if (!foundOnSite) {
      return next(new ErrorHandler('OnSiteNotFound', 404));
    }

    const onSiteSplited = splitOnSite(
      (foundOnSite as OnSiteSchema & any).starttime,
      (foundOnSite as OnSiteSchema & any).endtime,
      (foundOnSite as OnSiteSchema & any).step
    );
    // Doctors onsite times
    onSiteSplited.forEach(async (appoinmentTime: string) => {
      await timelineMode.create({
        onSiteId: (foundOnSite as OnSiteSchema & any)._id,
        doctorId: (foundOnSite as OnSiteSchema & any).doctorId,
        userId: getUserId(req.cookies?.auth_token),
        departmentId: (foundOnSite as OnSiteSchema & any).departmentId,
        date: (foundOnSite as OnSiteSchema & any).date,
        time: appoinmentTime,
        status: 'Unassigned',
      });
    });
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Inactive a OnSite times
export const inactiveOnsite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const foundOnSite = onSiteModel.findById(id);
    if (!foundOnSite) {
      return next(new ErrorHandler('OnSiteNotFound', 404));
    }

    // Inactive doctors onsite times
    await timelineMode.updateMany(
      {
        onSiteId: (foundOnSite as OnSiteSchema & any)._id,
      },
      { $set: { status: 'Canceled' } }
    );
  } catch (err: any) {
    return next(new ErrorHandler(err.message || 'InternalServerError', 500));
  }
};

// Calculate time array between start time and end time with step
const splitOnSite = (
  starttime: string,
  endtime: string,
  step: number
): string[] => {
  const startTime: number =
    parseInt(starttime.split(':')[0]) * 60 + parseInt(starttime.split(':')[1]);
  const endTime: number =
    parseInt(endtime.split(':')[0]) * 60 + parseInt(endtime.split(':')[1]);
  let timeInterval = startTime;
  const onSiteSplited: string[] = [];

  while (timeInterval <= endTime) {
    onSiteSplited.push(
      Math.floor(timeInterval / 60) + ':' + (timeInterval % 60)
    );
    timeInterval = timeInterval + step;
  }
  return onSiteSplited;
};
