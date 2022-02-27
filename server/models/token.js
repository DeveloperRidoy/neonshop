import mongoose from 'mongoose';
import crypto from 'crypto';

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: [true, 'userId is required'],
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  }, 
  expires: {
    type: Number, 
    required: true
  }, 
  expiresAt: Date
}, { timestamps: true });

TokenSchema.statics.genToken = () =>
  new Promise(async (resolve, reject) => {
    try {
      const token = crypto.randomBytes(32).toString("hex");
      resolve(token);
    } catch (error) {
      reject(error);
    }
  });
  
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.models.Token || mongoose.model("Token", TokenSchema);


export default Token;
