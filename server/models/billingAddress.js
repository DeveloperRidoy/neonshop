import mongoose from "mongoose";
import AddressSchema from "../schemas/AddressSchema";

const BillingAddress =
  mongoose.models.BillingAddress || mongoose.model("BillingAddress", AddressSchema);

export default BillingAddress;
