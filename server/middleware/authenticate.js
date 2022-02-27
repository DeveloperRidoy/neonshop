import User from '../models/user';
import AppError from '../utils/AppError';
import catchASync from '../utils/catchASync';
import removeToken from '../utils/removeToken';
import jwt from 'jsonwebtoken';
import ShippingAddress from '../models/shippingAddress';
import BillingAddress from '../models/billingAddress';

const authenticate = catchASync(async (req, res, next) => {
  const { token } = req.cookies;
  
  // check token
  if (!token) throw new AppError(400, "not logged in");
  if (typeof token !== "string") throw new AppError(400, "not logged in");

  // verify token 
  let verifiedToken = null;
  try { 
    verifiedToken = jwt.verify(token, process.env.JWT_SECRET); 
  } catch (error) {
     removeToken(res, "token");
    throw new AppError(400, "not logged in");
  }
  
  if (!verifiedToken || !verifiedToken.userId) {
     removeToken(res, "token"); 
    throw new AppError(400, "not logged in");
  };


  // check user
  const user = await User.findById(verifiedToken.userId)
    .select("+password")
    .populate([ 
      { path: "shippingAddress", model: ShippingAddress },
      { path: "billingAddress", model: BillingAddress },
    ]);
  if (!user) {
    removeToken(res, 'token'); 
    throw new AppError(400, "not logged in");
  }
  
  if (user.passwordChangedAt > verifiedToken.iat * 1000) {
    removeToken(res, "token");
    throw new AppError(400, "session expired, please login again");
  }

  // attach user to request
  req.user = user;

  // next middleware
  return next();
})

export default authenticate
