import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';

const uploadImage = ({buffer, width = 500, crop = 'scale', format = 'webp', folder= 'neonsignco/img'}) => new Promise(async (resolve, reject) => {
    try {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });  

      const stream = cloudinary.uploader.upload_stream(
        { folder, width, crop, format },
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );

      // buffer to readable stream
      streamifier.createReadStream(buffer).pipe(stream);
    } catch (error) { 
      return reject(error)
    }
})

export default uploadImage;