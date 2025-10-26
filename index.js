// 1. Import thư viện cần thiết
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db'); // Import hàm kết nối CSDL từ file db.js

// 2. Cấu hình .env
dotenv.config();

// Khai báo Port và URI từ .env
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 3. Khởi tạo ứng dụng express
const app = express();

// 1. IMPORT Router (Giả định file này tồn tại)
const userRoutes = require('./routes/userRoutes');

// 2. MIDDLEWARE: BẮT BUỘC phải có để đọc Body JSON từ Request (POST, PUT, PATCH).
app.use(express.json()); 

// 3. ĐỊNH TUYẾN GỐC: Tất cả các route trong userRoutes sẽ bắt đầu bằng /api/v1/users
app.use('/api/v1/users', userRoutes); 

// --- ROUTE KIỂM TRA TRẠNG THÁI SERVER VÀ DB ---
app.get('/api/v1/status', (req, res) => {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : 
                     mongoose.connection.readyState === 0 ? "Disconnected" :
                     "Connecting/Disconnecting";

    res.status(200).json({ 
        service: 'User Data API',
        version: '1.0.0',
        status: 'Server is running',
        database_status: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// API chào mừng (Định tuyến gốc)
// Route này sẽ bị route /api/v1/status ở trên che, nên tôi đã sửa lại đường dẫn
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API dữ liệu người dùng!');
});


// --- KHỞI ĐỘNG ỨNG DỤNG BẤT ĐỒNG BỘ (FIX CHÍNH) ---
const start = async () => {
    // B1: Đảm bảo MONGO_URI có giá trị
    if (!MONGO_URI) {
        console.error('❌ Lỗi: MONGO_URI không được định nghĩa trong file .env');
        console.error('Vui lòng kiểm tra lại file .env và chuỗi kết nối MongoDB Atlas.');
        process.exit(1);
    }
    
    try {
        // B2: Thực hiện kết nối Database (Chờ kết nối xong)
        console.log("Đang chờ kết nối MongoDB...");
        await connectDB(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");

        // B3: Lắng nghe các yêu cầu tại cổng (Chỉ chạy khi DB đã sẵn sàng)
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });

    } catch (error) {
        // B4: Xử lý lỗi nếu kết nối DB thất bại
        console.error('❌ KHỞI ĐỘNG THẤT BẠI. Lỗi kết nối CSDL:');
        console.error(error.message);
        // Thoát ứng dụng nếu DB không kết nối được
        process.exit(1); 
    }
};

start(); // Bắt đầu quá trình khởi động
