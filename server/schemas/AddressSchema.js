import mongoose from 'mongoose';


const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lastName is required"],
    },
    company: String,
    addressLine1: {
      type: String,
      required: [true, "addressLine1 is required"],
    },
    addressLine2: String,
    city: {
      type: String,
      required: [true, "city is required"],
    },
    stateOrProvince: {
      type: String,
      required: [true, "stateOrProvince is required"],
    },
    zip: {
      type: Number,
      required: [true, "zip is required"],
    },
    phone: Number,
  },
  { timestamps: true }
);

export default AddressSchema;