const express = require('express');
const router = express.Router(); 
const User = require('../models/User');
const mongoose = require('mongoose');

// Middleware bảo vệ & phân quyền
const { protect, authorize } = require('../middleware/authMiddleware');


/* =========================================================
   1. LẤY THÔNG TIN USER ĐANG ĐĂNG NHẬP
   GET /users/me
========================================================= */
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            message: "Lấy thông tin cá nhân thành công",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi Server",
            error: err.message
        });
    }
});


/* =========================================================
   2. LẤY DANH SÁCH USER – CHỈ ADMIN
   GET /users
========================================================= */
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            message: "Lấy danh sách Users thành công",
            count: users.length,
            data: users
        });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi Server",
            error: err.message
        });
    }
});


/* =========================================================
   3. LẤY CHI TIẾT USER THEO ID
   GET /users/:id
========================================================= */
router.get('/:id', protect, async (req, res) => {
    try {
        const userId = req.params.id;

        // Kiểm tra ObjectId hợp lệ
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: `Không tìm thấy User với ID: ${userId}` });
        }

        res.status(200).json({
            message: "Tìm thấy User",
            data: user
        });
    } catch (err) {
        res.status(500).json({
            message: "Lỗi Server",
            error: err.message
        });
    }
});


/* =========================================================
   4. CẬP NHẬT USER – CHÍNH CHỦ HOẶC ADMIN
   PUT /users/:id
========================================================= */
router.put('/:id', protect, async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        // Chỉ admin hoặc chính chủ mới được sửa
        if (req.user.role !== "admin" && req.user._id.toString() !== userId) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật user này" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: `Không tìm thấy User với ID: ${userId}` });
        }

        res.status(200).json({
            message: `Cập nhật User ID ${userId} thành công`,
            data: updatedUser
        });
    } catch (err) {
        res.status(400).json({
            message: "Cập nhật thất bại",
            error: err.message
        });
    }
});


/* =========================================================
   5. XÓA USER – CHỈ ADMIN
   DELETE /users/:id
========================================================= */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "ID không hợp lệ" });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: `Không tìm thấy User với ID: ${userId}` });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({
            message: "Lỗi Server",
            error: err.message
        });
    }
});

module.exports = router;
