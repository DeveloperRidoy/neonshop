import mongoose from 'mongoose';
import { BLACKACRYLIC, CLEARACRYLIC, CUT_TO_SHAPE, GOLDMIRRORACRYLIC, MIRRORACRYLIC, ROUND, SQUARE } from '../../context/NeonBuilderContext';
import ColorSchema from './ColorSchema';


const CustomItemSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "text is required"],
  },
  font: {
    type: Object,
    text: {
      type: String,
      required: [true, "font text is required"],
    },
    family: {
      type: String,
      required: [true, "font family is required"],
    },
    required: [true, "font is required"],
  },
  color: {
    type: ColorSchema,
    required: [true, "selectedColor is requried"],
  },
  size: {
    type: String,
    enum: {
      values: ["REGULAR", "LARGE"],
      default: "REGULAR",
      message: "size must be either regular or large",
    },
    required: [true, "size is required"],
  },
  icon: {
    type: Object,
    name: {
      type: String,
      required: [true, "name is required"],
    },
    link: {
      type: String,
      required: [true, "link is required"],
    },
    required: false,
  },
  backing: {
    type: Object,
    backingColor: {
      type: String,
      enum: {
        values: [CLEARACRYLIC, BLACKACRYLIC, MIRRORACRYLIC, GOLDMIRRORACRYLIC],
        default: CLEARACRYLIC,
        message: `backingColor must be on of ${CLEARACRYLIC}, ${BLACKACRYLIC}, ${MIRRORACRYLIC}, ${GOLDMIRRORACRYLIC}`,
      },
      required: [true, "backingColor is required"],
    },
    backingType: {
      type: String,
      enum: {
        values: [ROUND, SQUARE, CUT_TO_SHAPE],
        default: SQUARE,
        message: `backingType must be on of ${ROUND}, ${SQUARE}, ${CUT_TO_SHAPE}`,
      },
      required: [true, "backingType is required"],
    },
    required: [true, "backing is required"],
  },
  mountType: {
    type: String,
    enum: {
      values: ["WALL", "HANGING"],
      default: "WALL",
      message: "mountType must be one of WALL, HANGING",
    },
    required: [true, "mountType is required"],
  },
  note: String,
  price: Number,
  width: Number,
  count: Number,
});

export default CustomItemSchema;