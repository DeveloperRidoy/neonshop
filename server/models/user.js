import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcrypt from 'bcryptjs';
import ImageSchema from "../schemas/ImageSchema";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    userName: {
      type: String,
      required: [true, "userName is required"],
    },
    image: ImageSchema,
    email: {
      type: String,
      required: [true, "email is required"],
      minlength: 1,
      trim: true,
      index: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"], 
      select: false
    },
    passwordChangedAt: Number, 
    role: {
      type: String,
      enum: {
        values: ["ADMIN", "USER"],
        default: "USER",
        message: "role must be one of 'ADMIN', 'USER'",
      },  
      required: true
    },
  },
  { timestamps: true }
);


UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });

// virtual fields 
UserSchema.virtual('shippingAddress', {
  ref: 'shippingAddress', 
  foreignField: 'userId', 
  localField: '_id'
})

UserSchema.virtual("billingAddress", {
  ref: "billingAddress",
  foreignField: "userId",
  localField: "_id",
});

UserSchema.virtual("cart", {
  ref: "cart",
  foreignField: "userId",
  localField: "_id",
});

// plugins
UserSchema.plugin(uniqueValidator, {
  message: "User with same {PATH} already exists",
});

// static methods
UserSchema.statics.encryptPassword = (password) =>
  new Promise(async (resolve, reject) => {
    try {
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);
      resolve(hash);
    } catch (error) {
      reject(error);
    }
  });

  UserSchema.statics.verifyPassword = (password, hash) =>
    new Promise(async (resolve, reject) => {
      try {
        const verifiedPassword = await bcrypt.compare(password, hash)
        resolve(verifiedPassword);
      } catch (error) {
        reject(error);
      }
    });

const User = mongoose.models.User || mongoose.model("User", UserSchema); 

export default User;
