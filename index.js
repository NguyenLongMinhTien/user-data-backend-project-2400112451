/*
* ========================================
* FILE: INDEX.JS (MAIN SERVER FILE)
* MÔ TẢ: Khởi tạo Server Express, kết nối CSDL MongoDB,
* và định tuyến các API request.
* ========================================
*/

// --- 1. IMPORT CÁC MODULE CẦN THIẾT ---
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');

// --- 2. IMPORT CÁC ROUTER ---
const userRoutes = require('./routes/userRoutes');

// --- 3. CẤU HÌNH BIẾN MÔI TRƯỜNG ---
dotenv.config();

// --- 4. KHỞI TẠO ỨNG DỤNG EXPRESS ---
const app = express();

// --- 5. KẾT NỐI CƠ SỞ DỮ LIỆU (MONGODB ATLAS) ---
connectDB();

// --- 6. CẤU HÌNH MIDDLEWARE ---
app.use(express.json());

// --- 7. ĐỊNH TUYẾN (API ROUTES) ---
app.use('/api/v1/users', userRoutes);

// Route kiểm tra server + database
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to User Data Backend API (Week 3)",
    status: "Server is running",
    database_status: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// --- 8. KHỞI ĐỘNG SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log("Waiting for MongoDB connection...");
});
