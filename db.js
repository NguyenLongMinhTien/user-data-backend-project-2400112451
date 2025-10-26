const mongoose = require('mongoose');
require('dotenv').config(); // Ghi chú: Đọc file .env

/**
 * Hàm connectDB: Kết nối ứng dụng với MongoDB Atlas (dùng MONGO_URI từ .env).
 * Hàm này xử lý try/catch và in ra trạng thái kết nối.
 */
const connectDB = async () => {
    try{
        // Sử dụng biến môi trường (an toàn)
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully! Ready for use.'); // ✅ SỬA lỗi loq -> log
    }
    catch (err){
        console.error('❌ MongoDB connected failed:', err.message);
        // Ghi chú: Thoát ứng dụng nếu không thể kết nối Database
        process.exit(1); 
    }
};

// ✅ SỬA LỖI: Export chính xác hàm connectDB
module.exports = connectDB;
