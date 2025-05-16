const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (filePath) => {
    try {
      const results = await cloudinary.uploader.upload(filePath);
      
      return {
         url : results.secure_url,
         publicId : results.public_id
      }

    } catch (err) {
      console.error('Error while uploading to cloudinary', err);
      throw new Error('Error while uploading to cloudinary');
    }
}

module.exports =  uploadToCloudinary ;