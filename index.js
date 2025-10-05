// index.js

// 1. Import thư viện Express
const express = require('express');

// 2. Khởi tạo ứng dụng Express
const app = express();
const PORT = 3000; // Cổng Server thông dụng

// 3. Xây dựng Route/Endpoint đầu tiên (API chào mừng)
// Phương thức GET, đường dẫn '/'
app.get('/', (req, res) => {
  // Trả về phần hồi JSON
  res.json({ message: "Chào mừng đến với API Dữ liệu Người dùng!" });
});

// 4. API GET để kiểm tra trạng thái hoạt động của Server
app.get('/api/v1/status', (req, res) => {
  // Trả về một phản hồi JSON chứa thông tin trạng thái
  res.json({
    service: "User Data API",
    version: "1.0",
    health: "Good",
    timestamp: new Date().toISOString() // Thêm thời gian hiện tại
  });
});

// 5. Lắng nghe các yêu cầu tại cổng đã định nghĩa
app.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});
