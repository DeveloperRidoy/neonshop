import bcrypt from 'bcryptjs';
import User from "../models/user";
import AppError from '../utils/AppError';
import catchASync from '../utils/catchASync';
import isEmail from '../../utils/isEmail';
import Token from '../models/token';
import removeToken from '../utils/removeToken';
import setToken from '../utils/setToken';
import jwt from 'jsonwebtoken';
import uploadImage from '../utils/uploadImage';
import cloudinary from 'cloudinary';
import BillingAddress from '../models/billingAddress';
import ShippingAddress from '../models/shippingAddress';
import sendMail from '../utils/sendMail';
import crypto from 'crypto';

// @route       POST /api/users/register 
// @purpose     Register User
// @access      public
export const register = catchASync(async (req, res, next) => {
  const {
    email,
    password,
    confirmPassword,
    firstName,
    lastName,
    userName,
    photo,
  } = req.body;

  // check required fields
  if (!email) throw new AppError(400, "email is required");
  if (!isEmail(email)) {
    throw new AppError(400, "Email must be a valid email address.");
  }
  if (!password) throw new AppError(400, "password is required");
  if (!confirmPassword) throw new AppError(400, "confirmPassword is required");
  if (!firstName) throw new AppError(400, "firstName is required");
  if (!lastName) throw new AppError(400, "lastName is required");
  if (!userName) throw new AppError(400, "userName is required");

  if (password.length < 6 || password.length > 16) {
    throw new AppError(400, "Password must be 6 to 16 characters long");
  }

  if (password !== confirmPassword)
    throw new AppError(400, "passwords do not match");
  const encryptedPassword = await User.encryptPassword(password);
  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password: encryptedPassword,
    photo, 
    role: 'USER'
  });
 
  // sign jwt token 
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '14d'});

  // auth token
  setToken(res, 'token', token);
  
  // remove password before sending user 
  user.password = undefined;
  user.passwordChangedAt = undefined;
  return res.status(201).json({
    status: "success",
    message: "Successfully registered new user",
    user,
  });
})

// @route       POST /api/users/register-guest
// @purpose     Register guest with random userData
// @access      public
export const registerGuest = catchASync(async (req, res, next) => {

  const firstName = 'guest'; 
  const lastName = String(Math.round(Math.random() * 10000000000));
  const userName = firstName + ' ' + lastName;
  const email = firstName + lastName + '@gmail.com';
  const password = crypto.randomBytes(6).toString('hex'); 
  const encryptedPassword = await User.encryptPassword(password);

  const userData = {
    firstName,
    lastName,
    userName,
    email,
    password: encryptedPassword,
    role: "USER",
  };

  const user = await User.create(userData);
 
  // sign jwt token 
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '14d'});

  // auth token
  setToken(res, 'token', token);
  
  // remove password before sending user 
  user.password = undefined;
  user.passwordChangedAt = undefined;
  return res.status(201).json({
    status: "success",
    message: "Successfully registered guest user",
    user,
    password
  });
} )

// @route       POST /api/users/login 
// @purpose     Login User
// @access      public
export const login = catchASync(async (req, res) => {
  const { email, password } = req.body;
  if (!email) throw new AppError(400, "email is required");
  if (!isEmail(email)) throw new AppError(400, "not a valid email address");
  if (!password) throw new AppError(400, "password is required");
  
  if (typeof password !== "string")
    throw new AppError(400, "password must be a string");

  const user = await User.findOne({ email })
    .select("+password")
    .populate([
      { path: "shippingAddress", model: ShippingAddress },
      { path: "billingAddress", model: BillingAddress },
    ]);

  if (!user) throw new AppError(404, "User not found");
    
  const passwordValidated = await bcrypt.compare(password, user.password);
  if (!passwordValidated) {
    throw new AppError(400, "Incorrect password");
  }

  // remove sensitive data
  user.password = undefined;
  user.passwordChangedAt = undefined;
  // sign jwt token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {expiresIn: '14d'});

  // auth token
  setToken(res, "token", token);
  return res.json({
    status: "success",
    message: "login successful",
    user,
  });
})

// @route       GET /api/users/me 
// @purpose     Get logged in user   
// @access      User
export const getMe = catchASync(async (req, res) => {
  // remove sensitive data
  req.user.password = undefined;  
  req.user.passwordChangedAt = undefined;
  res.json({
    status: "success",
    message: "successfully authenticated user",
    user: req.user,
  });
})

// @route       DELETE /api/users/delete-me 
// @purpose     Delete user
// @access      User
export const deleteMe = catchASync(async (req, res) => {
  const user = req.user;
  const { password } = req.body;

  if (!user) throw new AppError(401, "not logged in ");
  
  if(!password) throw new AppError(400, 'password is required')
 
  if (typeof password !== "string") {
    throw new AppError(400, "invalid password");
  }

  const passwordValidated = await bcrypt.compare(password, user.password);
  if (!passwordValidated) {
    throw new AppError(400, "incorrect password");
  }

  // remove auth cookie
  removeToken(res, "token"); 

  if (user.image?.public_id) {
     cloudinary.config({
       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
       api_key: process.env.CLOUDINARY_API_KEY,
       api_secret: process.env.CLOUDINARY_API_SECRET,
     });  
     await cloudinary.v2.uploader.destroy(user.image.public_id);
   }

  // delete user
  await user.delete();

  // remove auth token 
  removeToken(res, 'token');

  //  remove all token in database 
  await Token.deleteMany({ userId: user._id });

  //  delete associating shipping and billing addresses 
  await ShippingAddress.deleteMany({userId: user._id})
  await BillingAddress.deleteMany({userId: user._id})

  res.json({
    status: "Success",
    message: "Account deleted",
  });
})

// @route       PUT /api/users/logout
// @purpose     Logout user
// @access      User
export const logOut = catchASync(async (req, res) => {

  if (!req.user) throw new AppError(401, "not logged in");

  // remove auth cookie
  removeToken(res, 'token');

  res.json({
    status: "success",
    message: "logout successful",
  });
})


// @route       GET /api/users
// @purpose     Get all users 
// @access      Public 
export const getAllUsers =  catchASync(async (req, res) => {
  const { page = 1, limit = 9999999 } = req.query;
  const skip = limit * (page - 1);

  if (!page)
    throw new AppError(400, "invalid page query. Page must me a number");
  if (!limit)
    throw new AppError(400, "invalid limit query. Limit must me a number");


  const users = await User.find().skip(skip).limit(limit);
    
  return res.json({
      status: "success",
      message: "successfully retrieved all users data",
      page,
    limit, 
      results: users.length,
      users
    });

}) 



// @route       POST /api/users/reset-password
// @purpose     reset password
// @access      token
export const resetPassword = catchASync(async (req, res) => {
  const { password, confirmPassword, token } = req.body;

  if (!password) throw new AppError(400, "password is required");
  if (password.length < 6 || password.length > 16)
    throw new AppError(400, "password must be between 6 to 16 characters long");

  if (!confirmPassword) throw new AppError(400, "confirmPassword is required");
  if (password !== confirmPassword)
    throw new AppError(400, "passwords do not match");

  const existingToken = await Token.findOne({ token });

  if (!existingToken) throw new AppError(400, "Invalid token");

  if (Date.now() > existingToken.expires) {
    await existingToken.delete();
    throw new AppError(400, "token already expired. Please request a new one");
  };

  const encryptedPassword = await User.encryptPassword(password);

  const existingUser = await User.findOneAndUpdate(
    { _id: existingToken.userId },
    {
      $set: {
        password: encryptedPassword,
        passwordChangedAt: Date.now() - 3000,
      },
    }, // minus 3 second so that jwt initiation time becomes greater than passwordChangedAt time so we can determine user session is valid
    { new: true }
  );

  if (!existingUser) throw new AppError(404, "user not found");  

  // delete the token
  await existingToken.delete();

  // new auth token
  const jwtToken = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });
  setToken(res, 'token', jwtToken);

  return res.json({
    status: "success",
    message: "password updated",
  });
})


// @route       PATCH users/change-password
// @purpose     change password
// @access      token
export const changePassword = catchASync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "not authorized");

  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) throw new AppError(400, "CurrentPassword is required");
  if (!newPassword) throw new AppError(400, "newPassword is required");
  if (newPassword.length < 6 || newPassword.length > 16)
    throw new AppError(400, "password must be between 6 to 16 characters long");
  if (!confirmPassword) throw new AppError(400, "confirmPassword is required");
  if (newPassword !== confirmPassword)
    throw new AppError(400, "passwords do not match");

  // check password
  const validPassword = await User.verifyPassword(
    currentPassword,
    user.password
  );
  if (!validPassword) throw new AppError(400, "incorrect password");

  const encryptedPassword = await User.encryptPassword(newPassword)
   await User.findOneAndUpdate(
     { _id: user._id },
     {
       $set: {
         password: encryptedPassword,
         passwordChangedAt: Date.now() - 3000,
       },
     }, // minus 3 second so that jwt initiation time becomes greater than passwordChangedAt time so we can determine user session is valid
     { new: true }
   );

  // sign jwt token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "14d",
  });

  // auth token
  setToken(res, "token", token);

  return res.json({
    status: "success",
    message: "password updated", 
  });
});

// @route       PATCH /api/users
// @purpose     User updates him/her self
// @access      User 
export const updateMe = catchASync(async (req, res) => {
  const { firstName, lastName, userName, email } = req.body;
  let image;
  const user = req.user; 

  if (!user) throw new AppError(400, 'not authorized');

  // update image if provided
  if (req.file) {
    // delete previous image if exists
    if (user.image?.public_id) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      await cloudinary.v2.uploader.destroy(user.image.public_id);
    }
    const img = await uploadImage({
      buffer: req.file.buffer,
      width: 200,
      folder: "neonsignco/img/users",
    });
    image = {
      version: img.version,
      public_id: img.public_id,
      url: img.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { firstName, lastName, userName, email, image } },
    { new: true, runValidators: true }
  );

  // remove sensitive data
  user.password = undefined;
  user.passwordChangedAt = undefined;
  return res.json({
    status: "success",
    message: "account details updated",
    user: updatedUser,
  });
})



// @route       POST /api/users/shipping-address
// @purpose     Add shipping address
// @access      User 
export const addShippingAddress = catchASync(async (req, res) => {
  const user = req.user; 
  if (!user) throw new AppError(401, 'not authorized');

  const { country,
    firstName,
    lastName,
    company,
    city,
    addressLine1,
    addressLine2,
    stateOrProvince,
    zip,
    phone } = req.body;

  // check all required fields
  const check = (field, name) => { if (!field) throw new AppError(400, `${name} is required`) }; 
  check(country, 'country');
  check(firstName, 'firstName');
  check(lastName, 'lastName');
  check(city, 'city');
  check(addressLine1, 'addressLine1');
  check(stateOrProvince, 'stateOrProvince');
  check(zip, 'zip');
  
  // check if already has a billingAddress 
  const existingShippingAddress = await ShippingAddress.findOne({ userId: user._id }).select('_id').lean(); 

  if (existingShippingAddress) throw new AppError(401, 'user already has a shipping address');

  const shippingAddress = await ShippingAddress.create({country, firstName, lastName, company, city, addressLine1, addressLine2, stateOrProvince, zip, phone, userId: user._id});
  
   return res.json({
     status: "success",
     message: "shipping address added",
     shippingAddress
   });
})

// @route       PATCH /api/users/shipping-address
// @purpose     Edit shipping address
// @access      User 
export const updateShippingAddress = catchASync(async (req, res) => {
  const user = req.user; 
  if (!user) throw new AppError(401, 'not authorized');

  const { country,
    firstName,
    lastName,
    company,
    city,
    addressLine1,
    addressLine2,
    stateOrProvince,
    zip,
    phone } = req.body;

  const shippingAddress = await ShippingAddress.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        country,
        firstName,
        lastName,
        company,
        city,
        addressLine1,
        addressLine2,
        stateOrProvince,
        zip,
        phone,
      },
    },
    {new: true, runValidators: true}
  );
  
   return res.json({
     status: "success",
     message: "shipping address updated",
     shippingAddress
   });
})



// @route       POST /api/users/billing-address
// @purpose     Add billing address
// @access      User 
export const addBillingAddress = catchASync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "not authorized");

  const {
    country,
    firstName,
    lastName,
    company,
    city,
    addressLine1,
    addressLine2,
    stateOrProvince,
    zip,
    phone,
  } = req.body;

  // check all required fields
  const check = (field, name) => {
    if (!field) throw new AppError(400, `${name} is required`);
  };
  check(country, "country");
  check(firstName, "firstName");
  check(lastName, "lastName");
  check(city, "city");
  check(addressLine1, "addressLine1");
  check(stateOrProvince, "stateOrProvince");
  check(zip, "zip");

  // check if already has a billingAddress
  const existingBillingAddress = await BillingAddress.findOne({
    userId: user._id,
  })
    .select("_id")
    .lean();

  if (existingBillingAddress)
    throw new AppError(401, "user already has a billing address");

  const billingAddress = await BillingAddress.create({
    country,
    firstName,
    lastName,
    company,
    city,
    addressLine1,
    addressLine2,
    stateOrProvince,
    zip,
    phone,
    userId: user._id,
  });

  return res.json({
    status: "success",
    message: "billing address added",
    billingAddress,
  });
});

// @route       PATCH /api/users/billing-address
// @purpose     Edit billing address
// @access      User 
export const updateBillingAddress = catchASync(async (req, res) => {
  const user = req.user;
  if (!user) throw new AppError(401, "not authorized");

  const {
    country,
    firstName,
    lastName,
    company,
    city,
    addressLine1,
    addressLine2,
    stateOrProvince,
    zip,
    phone,
  } = req.body;

  const billingAddress = await BillingAddress.findOneAndUpdate(
    { userId: user._id },
    {
      $set: {
        country,
        firstName,
        lastName,
        company,
        city,
        addressLine1,
        addressLine2,
        stateOrProvince,
        zip,
        phone,
      },
    },
    { new: true, runValidators: true }
  );

  return res.json({
    status: "success",
    message: "billing address updated",
    billingAddress,
  });
});


// @route       POST /api/users/forgot-password
// @purpose     send forgot password link
// @access      Public

export const forgotPassword = catchASync(async (req, res) => {
    const email = req.body.email;

    if (!email) throw new AppError(400, 'email is required'); 

     if (!isEmail(email)) throw new AppError(400, "not a valid email address"); 

    const existingUser = await User.findOne({ email }).select('firstName'); 

    if(!existingUser) throw new AppError(400, "user not found"); 

  const token = await Token.genToken(); 

    const newToken = await Token.findOneAndUpdate(
      { userId: existingUser._id },
      {
        $set: {
          userId: existingUser._id,
          token,
          expires: Date.now() + 1000 * 60 * 60 * 24,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        },
      }, // 1 day limit
      { new: true, upsert: true }
    );
   
  const text = `Hello ${existingUser.firstName}, visit this link to reset your password: ${req.headers.origin}/forgot-password/${newToken.token}`;

    await sendMail({
      from: `"NeonSignCo" <${process.env.MAIL_SMTP_USERNAME}>`,
      to: email,
      subject: "Password Reset",
      text,
    });

    return res.json({
    status: "success",
        message: "check your email to get password reset link", 
  });
});





