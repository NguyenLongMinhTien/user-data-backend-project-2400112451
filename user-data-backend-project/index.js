// index.js
// 1. Import thư viện Express
const express = require('express');

// 2. Khởi tạo ứng dụng Express
const app = express();

// 3. Cấu hình port
const PORT = 3000;

// 4. Xử lý route/Endpoint đầu tiên (API chào mừng)
app.get('/', (req, res) => {
  // Trả về phản hồi JSON
  res.json({ message: "Chào mừng đến với API của tôi nhé!" });
});

// 5. Thêm Route mới: GET /api/v1/status
app.get('/api/v1/status', (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// 6. Lắng nghe cổng để chạy server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});