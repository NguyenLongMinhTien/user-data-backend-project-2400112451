const express = require('express');
const router = express.Router(); 
const User = require('../models/User'); // Import Model User (Đảm bảo đường dẫn này là chính xác)
const {upload, uploadToCloudinary} = require('../utils/cloudinary');

// // 1. ENDPOINT: TẠO NGƯỜI DÙNG (CREATE)
// // Phương thức: POST | Đường dẫn cuối cùng: /
// Chuyển qua cho authroutes. 

 // Import middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// ----------------------------------------------------
// 2. ENDPOINT: LẤY DANH SÁCH USER (Chỉ Admin)
// Phương thức: GET | Đường dẫn: /api/v1/users/
// ----------------------------------------------------
// Ghi chú: Thêm 'protect' và 'authorize('admin')' vào
router.get('/', protect, authorize('admin'), async (req, res) => {
 try {
    const users = await User.find();
    res.status(200).json({
        message: "Lấy danh sách Users thành công (Admin only)",
        count: users.length,
        data: users
  });
 } 
 catch (err) {
 res.status(500).json({ message: "Lỗi Server", error: err.message });
 }
});
// 7. CẬP NHẬT HỒ SƠ CÁ NHÂN (User tự sửa)
//PUT/api/v1/users/me
router.put('/me', protect, async (req, res) => {
    try {
    // Lọc dữ liệu đầu vào: Chỉ cho phép sửa name, phone, address...
    // KHÔNG cho phép sửa: password, role, email (tùy nghiệp vụ)
    const {profile} =  req.body;
    // Tim user theo ID (lây từ Token qua req.user._id)
    // new: true } để trả về data mới sau khi update
    // runValidators: true để đảm bảo dữ liệu mới vẫn đúng chuẩn Schema
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {profile: profile},
        {new: true, runValidators: true}
    ).select('-password'); // Không trả về password

    res.status(200).json({
        message: "Cập nhật hồ sơ thành công",
        data: updatedUser
    });

    }catch (err) {
        res.status(400).json({message: "Cập nhật thất bại", error: err.message});
    }
});
// ----------------------------------------------------
// 3. ENDPOINT: LẤY THÔNG TIN CÁ NHÂN (Profile)
// Phương thức: GET | Đường dẫn: /api/v1/users/me
// (Tạo Endpoint mới cho test case của bạn)
// ----------------------------------------------------
// Ghi chú: Chỉ cần 'protect', không cần 'authorize'
router.get('/me', protect, async (req, res) => {
 // Ghi chú: Middleware 'protect' đã tìm user và gán vào req.user
 // Chúng ta chỉ cần trả về req.user
 res.status(200).json({
 message: "Lấy thông tin cá nhân thành công",
 data: req.user
 });
});
// ----------------------------------------------------
// 4. ENDPOINT: LẤY CHI TIẾT USER (Chỉ Admin)
// Phương thức: GET | Đường dẫn: /api/v1/users/:id
// ----------------------------------------------------
router.get('/:id', protect, authorize('admin'), async (req, res) => {
 try {
 const user = await User.findById(req.params.id);
 if (!user) {
 return res.status(404).json({ message: `Không tìm thấy User` });
 }
 res.status(200).json({ message: "Tìm thấy User", data: user });
 } catch (err) {
 res.status(500).json({ message: "Lỗi Server", error: err.message });
 }
});

// ----------------------------------------------------
// 5. ENDPOINT: CẬP NHẬT USER (Chỉ Admin)
// Phương thức: PUT | Đường dẫn: /api/v1/users/:id
// ----------------------------------------------------
router.put('/:id', protect, authorize('admin'), async (req, res) => {
 try {
 // (Logic PUT giữ nguyên...)
 const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true,
runValidators: true });
 if (!updatedUser) {
 return res.status(404).json({ message: `Không tìm thấy User` });
 }
 res.status(200).json({ message: `Cập nhật User thành công`, data: updatedUser });
 } catch (err) {
 res.status(400).json({ message: "Cập nhật thất bại", error: err.message });
 }
});

// ----------------------------------------------------
// 6. ENDPOINT: XÓA USER (Chỉ Admin)
// Phương thức: DELETE | Đường dẫn: /api/v1/users/:id
// ----------------------------------------------------
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
 try {
 // (Logic DELETE giữ nguyên...)
 const deletedUser = await User.findByIdAndDelete(req.params.id);
 if (!deletedUser) {
 return res.status(404).json({ message: `Không tìm thấy User` });
 }
 res.status(204).send();
 } catch (err) {
 res.status(500).json({ message: "Lỗi Server", error: err.message });
 }
});

// 8. LẤY DANH SÁCH USER (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json({
            count: users.length,
            data: users
        });
    }catch (err) {
        res.status(500).json({ error: err.message});
    }
});
// 9. XÓA USER (Admin only - Quyền được quên/Xử lí vi phạm)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy User" });
        }

        // Thực hiện xóa
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Đã xóa User thành công" });
    }catch (err){
        res.status(500).json ({ error: err.message });
    }
});
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400);
            throw new Error('Vui lòng tải lên một tệp hình ảnh.');
        }
        // 1. Upload len Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);
        // 2. Cập nhật URL ảnh đại diện vào hồ sơ người dùng
        const user = await User.findById(req.user._id);
        user.profile.avatarUrl = result.secure_url;
        await user.save({validateBeforeSave: false});
        res.status(200).json({
            message: 'Tải lên ảnh đại diện thành công',
            avatarUrl: result.secure_url
        });
    } catch (err) {
        next(error);
    }
});
// BẮT BUỘC: Export đối tượng router để index.js có thể sử dụng
module.exports = router;
