import mongoose from "mongoose";
import CustomItemSchema from "../schemas/CustomItemSchema";
import ItemSchema from "../schemas/ItemSchema";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId is required"],
    },
    items: [ItemSchema],
    customItems: [CustomItemSchema],
    subTotal: Number,
    discount: Number,
    total: Number,
    expireAt: Date
  },
  { timestamps: true }
);


CartSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

export default Cart;
