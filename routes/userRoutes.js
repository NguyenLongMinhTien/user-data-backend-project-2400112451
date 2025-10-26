// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// ----------------------------------------------------
// 1. ENDPOINT: Lấy Danh sách Người dùng (READ All)
// Phương thức: GET | Đường dẫn cuối cùng: /api/v1/users/
router.get('/', (req, res) => {
  const userList = [
    { id: 1, username: "Alice" },
    { id: 2, username: "Bob" }
  ];

  res.status(200).json({
    message: "Lấy danh sách người dùng thành công (200 OK)",
    data: userList
  });
});

// ----------------------------------------------------
// 2. ENDPOINT: Tạo Người dùng Mới (CREATE)
// Phương thức: POST | Đường dẫn cuối cùng: /api/v1/users/
router.post('/', (req, res) => {
  const userData = req.body;

  res.status(201).json({
    message: "Người dùng đã được tạo thành công (201 Created)",
    receivedData: userData
  });
});

// ----------------------------------------------------
// 3. ENDPOINT: Lấy Chi tiết Người dùng (READ One)
// Phương thức: GET | Đường dẫn cuối cùng: /api/v1/users/:id
router.get('/:id', (req, res) => {
  const userId = req.params.id;

  // [LOGIC ẢO]: Chỉ có ID=1 là tồn tại
  if (userId === '1') {
    res.status(200).json({
      message: `GET: Chi tiết người dùng ID: ${userId} thành công`,
      data: {
        id: userId,
        username: "Alice",
        status: "active",
        email: "alice@dev.com"
      }
    });
  } else {
    res.status(404).json({
      message: `GET: Không tìm thấy người dùng có ID: ${userId}`
    });
  }
});

// ----------------------------------------------------
// 4. ENDPOINT: Cập nhật Người dùng (UPDATE)
// Phương thức: PUT | Đường dẫn cuối cùng: /api/v1/users/:id
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  res.status(200).json({
    message: `PUT: Cập nhật người dùng ID ${userId} thành công (200 OK)`,
    updatedData: updateData
  });
});

// ----------------------------------------------------
// 5. ENDPOINT: Xóa Người dùng (DELETE)
// Phương thức: DELETE | Đường dẫn cuối cùng: /api/v1/users/:id
router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  // [LOGIC ẢO]: Giả định luôn xóa thành công
  res.status(204).send();
});

module.exports = router;
