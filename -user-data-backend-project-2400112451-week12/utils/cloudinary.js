/* FILE: UTILS/cloudinary.js */
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// 1. cau hinh cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cau hinh multer (luu file vao bo nho tam RAM)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 3. Ham upload len cloudinary tu Buffer
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {folder: 'vlsc-shop'},
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(buffer);
    });
};
module.exports = { upload, uploadToCloudinary };