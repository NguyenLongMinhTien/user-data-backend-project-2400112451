const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Helper: whitelist fields from req.body
function pick(obj, keys) {
  return keys.reduce((acc, k) => {
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
}

// 1. CREATE
router.post('/', async (req, res, next) => {
  try {
    // CHỈ cho phép những field cơ bản được tạo bởi client
    const allowed = ['username', 'email', 'password', 'profile'];
    const payload = pick(req.body, allowed);

    const createdUser = await User.create(payload); // pre('save') sẽ chạy và hash password

    const userObj = createdUser.toObject();
    delete userObj.password; // đảm bảo không trả password

    res.status(201).json({
      status: 'success',
      data: { user: userObj }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ status: 'fail', message: err.message, errors: err.errors });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      return res.status(409).json({ status: 'fail', message: `${field} already exists` });
    }
    next(err);
  }
});

// 2. READ ALL
router.get('/', async (req, res, next) => {
  try {
    // bỏ trường password khi trả về
    const users = await User.find().select('-password');
    res.status(200).json({ status: 'success', count: users.length, data: users });
  } catch (err) {
    next(err);
  }
});

// 3. READ ONE
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
});

// 4. UPDATE
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Nếu client cố gắng set role/cart/orders, loại bỏ
    const allowed = ['username', 'email', 'profile', 'phone']; // không cho phép cập nhật password ở đây theo cách bypass hook
    const updateData = pick(req.body, allowed);

    // Nếu muốn cho phép thay đổi password: phải xử lý khác (dưới)
    if (req.body.password) {
      // Bắt buộc dùng save() để pre('save') hash password
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ status: 'fail', message: 'User not found' });

      // cập nhật các trường thường
      Object.assign(user, updateData);
      // cập nhật password thô => pre('save') sẽ hash
      user.password = req.body.password;
      await user.save();

      const userObj = user.toObject();
      delete userObj.password;
      return res.status(200).json({ status: 'success', data: userObj });
    }

    // Nếu không thay password, dùng findByIdAndUpdate cho hiệu năng
    const updated = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
    if (!updated) return res.status(404).json({ status: 'fail', message: 'User not found' });

    res.status(200).json({ status: 'success', data: updated });
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(400).json({ status: 'fail', message: err.message });
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      return res.status(409).json({ status: 'fail', message: `${field} already exists` });
    }
    next(err);
  }
});

// 5. DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ status: 'fail', message: 'User not found' });
    // trả 204 No Content hợp chuẩn
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
