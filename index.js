// index.js
require('dotenv').config();
// Build MONGO_URI từ các biến riêng nếu chưa có
if (!process.env.MONGO_URI) {
  const u = encodeURIComponent(process.env.MONGO_USER || '');
  const p = encodeURIComponent(process.env.MONGO_PASS || '');
  const h = process.env.MONGO_HOST;
  const d = process.env.MONGO_DBNAME;
  const o = process.env.MONGO_OPTIONS || 'retryWrites=true&w=majority';

  if (!u || !p || !h || !d) {
    console.error('❌ Thiếu MONGO_USER hoặc MONGO_PASS hoặc MONGO_HOST hoặc MONGO_DBNAME');
    process.exit(1);
  }

  process.env.MONGO_URI = `mongodb+srv://${u}:${p}@${h}/${d}?${o}`;
  console.log("🔧 Đã tạo MONGO_URI tự động từ .env");
}

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const connectDB = require('./db');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();
app.use(express.json());

// Cố gắng import userRoutes nếu file tồn tại - tránh crash nếu chưa có routes
try {
  const userRoutesPath = path.join(__dirname, 'routes', 'userRoutes.js');
  if (fs.existsSync(userRoutesPath)) {
    const userRoutes = require('./routes/userRoutes');
    app.use('/api/v1/users', userRoutes);
  } else {
    console.warn('⚠️ Warning: ./routes/userRoutes.js không tồn tại. Bỏ qua route /api/v1/users.');
  }
} catch (err) {
  console.warn('⚠️ Warning: lỗi khi load userRoutes:', err.message);
}

// Health check & DB status
app.get('/api/v1/status', (req, res) => {
  const readyState = mongoose.connection.readyState;
  const dbStatus = readyState === 1 ? 'Connected' :
                   readyState === 0 ? 'Disconnected' : 'Connecting/Disconnecting';
  res.status(200).json({
    service: 'User Data API',
    version: '1.0.0',
    status: 'Server is running',
    database_status: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => res.send('Chào mừng bạn đến với API dữ liệu người dùng!'));

const start = async () => {
  if (!MONGO_URI) {
    console.error('❌ Lỗi: MONGO_URI không được định nghĩa trong file .env');
    process.exit(1);
  }

  try {
    console.log('Đang kết nối MongoDB...');
    await connectDB(MONGO_URI); // truyền thẳng để rõ ràng
    console.log('✅ MongoDB Connected. Khởi động server...');
    app.listen(PORT, () => console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ KHỞI ĐỘNG THẤT BẠI:', err.message);
    process.exit(1);
  }
};

start();
