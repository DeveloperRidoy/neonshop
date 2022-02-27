import catchAsync from '../utils/catchASync'
import connectDb from '../utils/connectDb';

const dbConnection = catchAsync(async (req, res, next) => {
    await connectDb(); 
    return next();
})

export default dbConnection;