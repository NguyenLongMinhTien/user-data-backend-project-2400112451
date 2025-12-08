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
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');   // <-- THÊM THEO SLIDE

// 2. MIDDLEWARE: BẮT BUỘC phải có để đọc Body JSON từ Request (POST, PUT, PATCH).
app.use(express.json()); 

// 3. ĐỊNH TUYẾN GỐC: Tất cả các route trong userRoutes sẽ bắt đầu bằng /api/v1/users
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);    // <-- THÊM THEO SLIDE

// --- ROUTE KIỂM TRA TRẠNG THÁI SERVER VÀ DB ---
app.get('/api/v1/status', (req, res) => {
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

// Route gốc
app.get('/', (req, res) => {
    res.send('Chào mừng bạn đến với API dữ liệu người dùng!');
});


// --- KHỞI ĐỘNG ỨNG DỤNG BẤT ĐỒNG BỘ (FIX CHÍNH) ---
const start = async () => {
    if (!MONGO_URI) {
        console.warn('⚠️  Cảnh báo: MONGO_URI không được định nghĩa trong file .env. Server sẽ chạy mà không có kết nối đến MongoDB.');
        console.warn('Nếu bạn muốn kết nối đến MongoDB, hãy thêm MONGO_URI vào .env và khởi động lại ứng dụng.');

        app.listen(PORT, () => {
            console.log(`🚀 Server (no-db mode) đang chạy tại http://localhost:${PORT}`);
        });

        return;
    }
    
    try {
        console.log("Đang chờ kết nối MongoDB...");
        await connectDB(MONGO_URI);
        console.log("✅ MongoDB Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ KHỞI ĐỘNG THẤT BẠI. Lỗi kết nối CSDL:');
        console.error(error.message);
        process.exit(1); 
    }
};

start();
