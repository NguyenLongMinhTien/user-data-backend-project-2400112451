/* FILE: ROUTES/ORDERROUTES.JS */
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const {protect, authorize} = require('../middleware/authMiddleware');

/* 1. TẠO ĐƠN HÀNG MỚI
   POST /api/v1/orders */
router.post('/', protect, async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        const newOrder = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress
        });
        res.status(201).json({ message: "Dat hang thanh cong", data: newOrder });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Lay Don Hang Cua Toi
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
        .populate('user', 'username email')
        .sort('-createdAt');

        res.status(200).json({ count: orders.length, data: orders });  
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// 3. Lay Tat Ca Don Hang (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('user', 'username email')
        .sort('-createdAt');    
        res.status(200).json({ count: orders.length, data: orders });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }  
});

module.exports = router;