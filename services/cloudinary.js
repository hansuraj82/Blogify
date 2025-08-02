require('dotenv').config();
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


const uploadOnCloudinary = async (localPath) => {
    try {
        const cloudinaryUpload = await cloudinary.uploader.upload(localPath, {
            folder: 'Blog-cover-photo'
        });

        return cloudinaryUpload.url;
    }
    catch (error) {
        fs.unlinkSync(localPath);
    }
}



module.exports = uploadOnCloudinary;