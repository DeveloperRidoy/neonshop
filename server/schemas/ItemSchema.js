import mongoose from 'mongoose';
import ColorSchema from './ColorSchema';
import SizeSchema from './SizeSchema'

const ItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: [true, "product is required"],
  },
  selectedSize: {
    type: SizeSchema,
    required: [true, 'selectedSize is required'],
  },
  selectedColor: {
    type: ColorSchema,
    required: [true, "selectedColor is requried"],
  },
  selectedMountType: {
    type: String,
    enum: {
      values: ["WALL", "HANGING"],
      message: "selectedMountType must be either WALL or HANGING",
    },
    required: [true, "selectedMountType is required"],
  },
  count: {
    type: Number,
    required: [true, "count is required"],
  },
});


export default ItemSchema;