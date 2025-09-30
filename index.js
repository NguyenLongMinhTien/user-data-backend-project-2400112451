// index.js

// 1. Import thư viện express
const express = require('express');

// 2. Khởi tạo ứng dụng express
const app = express();
const PORT = 3000; // Cổng Server thường dùng

// 3. Xây dựng Route/Endpoint đầu tiên (API chào mừng)
// Phương thức GET, đường dẫn '/'
app.get('/', (req, res) => {
  res.send('Chào mừng bạn đến với API dữ liệu người dùng!');
});

// API GET để kiểm tra trạng thái hoạt độngn của server
app.get('/api/v1/status', (req, res) => {
    // Trả về một phản hồi JSON chứa thông tin trạng thái
    res.json({
        service: 'User Data API',
        version: '1.0.0',
        status: 'Good',
        timestamp: new Date().toISOString() // Thêm thời gian hiện tại
    });
});

// 4. Lắng nghe các yêu cầu tại cổng đã định nghĩa
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});