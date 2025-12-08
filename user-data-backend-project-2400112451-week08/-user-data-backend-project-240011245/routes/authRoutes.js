const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Tạo token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    console.error('🔥 JWT_SECRET is not defined in .env');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '30d'
  });
};

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, profile } = req.body; // Không nhận role từ client

    // Basic presence check (đỡ phải chờ Mongoose)
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Thiếu username hoặc email hoặc password' });
    }

    // Kiểm tra username/email đã tồn tại
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username đã tồn tại!' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email đã tồn tại!' });
    }

    // Tạo user mới (role mặc định là 'user')
    const newUser = await User.create({
      username,
      email,
      password,
      profile
      // role không nhận từ client
    });

    return res.status(201).json({
      message: 'Tạo User thành công!',
      data: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role
      },
      token: generateToken(newUser._id)
    });

  } catch (err) {
    console.error('REGISTER ERROR:', err);
    // Duplicate key lỗi (mongo)
    if (err.code && err.code === 11000) {
      const field = Object.keys(err.keyValue || {})[0];
      return res.status(400).json({ message: `${field || 'Field'} đã tồn tại!`, details: err.keyValue });
    }
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    return res.status(500).json({ message: "Tạo User thất bại", error: err.message });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email và password là bắt buộc' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });

  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

module.exports = router;
