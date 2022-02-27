import mongoose from 'mongoose';
import ImageSchema from '../schemas/ImageSchema';


const SizeSchema = new mongoose.Schema({
  info: {
    type: String,
    validate: {
      validator: (val) => typeof val === "string",
      message: "info must be stirng",
    },
    required: [true, "info is required for size"],
  },
  price: {
    type: Number,
    validate: {
      validator: (val) => typeof val === "number",
      message: "price must be number",
    },
    required: [true, "price is required for size"],
  },
});


const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    images: [ImageSchema],
    category: {
      type: mongoose.Schema.ObjectId,
      required: [true, "product category is required"],
      ref: "category",
    },
    sizes: [SizeSchema], 
    salePercentage: Number
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
