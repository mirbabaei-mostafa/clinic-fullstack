import { UserSchema, UserList } from '../db/models/userModel';

export const userTrim = (
  foundUsers: UserSchema[] | undefined
): UserList[] | undefined => {
  if (typeof foundUsers !== 'undefined') {
    const usersTrimed: UserList[] = [];
    foundUsers.forEach((user) => {
      usersTrimed.push({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        username: user.username,
        image: user.image,
        avatar: user.avatar,
        gender: user.gender,
        phone: user.phone,
        mobile: user.mobile,
        address: user.address,
        birth_year: user.birth_year,
        birth_month: user.birth_month,
        birth_day: user.birth_day,
        role: user.role,
        department: user.department,
        verify: user.verify,
      });
    });
    return usersTrimed;
  } else {
    return foundUsers;
  }
};
