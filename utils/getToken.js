import Token from '../server/models/token';
import connectDb from '../server/utils/connectDb';

    
const getToken = async (token) => {
    try {  
        await connectDb();
        const existingToken = await Token.findOne({ token }); 
        if (!existingToken) return null;
        return existingToken
       
    } catch (error) {
        console.log(error)
        return null;
    }
}             

export default getToken;
