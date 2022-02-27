import mongoose from 'mongoose';
import AddressSchema from '../schemas/AddressSchema';



const ShippingAddress =
  mongoose.models.ShippingAddress ||
  mongoose.model("ShippingAddress", AddressSchema); 


export default ShippingAddress;