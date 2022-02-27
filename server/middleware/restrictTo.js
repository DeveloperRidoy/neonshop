import AppError from "../utils/AppError";
import catchASync from "../utils/catchASync";

const restrictTo = (...roles) => catchASync(async (req, res, next) => {
  if (!req.user) throw new AppError(401, 'not authorized'); 

  if (!roles.includes(req.user.role)) throw new AppError(401, 'not authorized');

  // proceed if authenticated 
  return next();
})

export default restrictTo;
