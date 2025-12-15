const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,{
        expiresIn: '30d',
    });
};

router.post('/register', async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            profile,
            role,
        } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists){
            return res.status(400). json({ message: 'Email đã tồn tại' });
        }

        const newUser = await User.create ({
            username,
            email,
            password,
            profile,
            role,

        });

        if (newUser) {
            res.status(201).json({
                message: 'Tạo User thành công! ',
                data: {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                },
                token: generateToken(newUser._id)
            });
        }
    } 
    catch (err) {
        res.status(400).json ({ message: 'Tạo User thất bại', error:err.message});
    }

});

router.post ('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne ({ email }).select('+password');

        if (!user) {
            return res.status(401).json ({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch){
            return res.status(401).json({ message: 'Email hoặc mật khẩu ko đúng '})
        }

        res.status(200).json({
            message: 'Đăng nhập thành công',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
            token: generateToken(user._id)
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi Server', error: err.message});
    }
});

module.exports = router;
