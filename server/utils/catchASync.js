const mongoose = require("mongoose");

const catchASync = (fn) => (req, res, next) =>
  fn(req, res, next).catch((err) => {
    // log error message in development
    if (process.env.NODE_ENV !== "production") console.log(err, err.stack);

    // handle mongoose validation error
    if (err instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        status: "Fail",
        message: err.errors[Object.keys(err.errors)[0]].message,
      });
    }

    if(err && err.code === 11000) return res.status(400).json({
        status: "Fail",
        message: 'document with same name already exists',
      });
    
    const code = err.code || 500;
    const status =
      code === 400
        ? "Bad Request"
        : code === 401
        ? "Unauthorized"
        : code === 404
        ? "Not Found"
        : "Fail";

    return res.status(code).json({
      status,
      message:err.message,
    });
  });

module.exports = catchASync;
