import mongoose from "mongoose";
import isEmail from "../../utils/isEmail";
import AddressSchema from "../schemas/AddressSchema";
import CustomItemSchema from "../schemas/CustomItemSchema";
import ItemSchema from "../schemas/ItemSchema";


const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    contactEmail: {
      type: String,
      validate: {
        validator: (val) => isEmail(val),
        message: "not a valid email address",
      },
      required: [true, "contactEmail is required"],
    },
    guestCheckout: {
      type: Boolean,
      enum: {
        values: [true, false], 
        message: "guestCheckout must be either true or false"
      },
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: [
          "PENDING_PAYMENT",
          "ORDERED",
          "PROCESSING",
          "DELIVERED",
          "CANCELLED",
        ],
        default: "PENDING_PAYMENT",
        message:
          "status must be one of 'PENDING_PAYMENT', 'ORDERED', 'PROCESSING', 'DELIVERED', 'CANCELLED",
      },
    },
    shippingAddress: {
      type: AddressSchema,
      required: [true, "shippingAddress is required"],
    },
    items: [ItemSchema],
    customItems: [CustomItemSchema],
    subTotal: Number,
    discount: Number,
    total: Number,
    expireAt: Date,
  },
  { timestamps: true }
);

OrderSchema.index({ expireAt: 1 }, { expireAfterSeconds:  0 });

const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
