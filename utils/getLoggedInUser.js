import User from "../server/models/user";
import connectDb from "../server/utils/connectDb";
import jwt from 'jsonwebtoken';
import ShippingAddress from "../server/models/shippingAddress";
import BillingAddress from "../server/models/billingAddress";

const getLoggedInUser = async (req) => {
    try {
        const { token } = req.cookies;
       
        // check token
        if (!token) return null;
        if (typeof token !== "string") return null;
  
        // verify token 
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken || !verifiedToken.userId) return null;
          
        // check user
        const user = await User.findById(verifiedToken.userId)
          .populate([
            { path: "shippingAddress", model: ShippingAddress },
            { path: "billingAddress", model: BillingAddress }
          ])
          .lean();

        if (!user) return null;
  
        if (user.passwordChangedAt > verifiedToken.iat * 1000) return null;
        
      return user;
    } catch (error) {
        return null;  
    }
}

export default getLoggedInUser
