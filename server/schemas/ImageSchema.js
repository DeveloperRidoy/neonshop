import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    validate: {
      validator: (val) => typeof val === "string",
      message: "url must be stirng",
    },
    required: [true, "url is required"],
  },
  version: {
    type: Number,
    validate: {
      validator: (val) => typeof val === "number",
      message: "version must be number",
    },
    required: [true, "version is required"],
  },
  public_id: {
    type: String,
    validate: {
      validator: (val) => typeof val === "string",
      message: "public_id must be stirng",
    },
    required: [true, "public_id is required"],
  },
});


export default ImageSchema;