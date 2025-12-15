/* FILE: ROUTES/PRODUCTROUTES.JS */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. LẤY DANH SÁCH (Public - Ai cũng xem được)
// GET /api/v1/products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ count: products.length, data: products });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. TẠO SẢN PHẨM (Admin only)
// POST /api/v1/products
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Tạo sản phẩm thành công", data: newProduct });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 3. XÓA SẢN PHẨM (Admin only)
// DELETE /api/v1/products/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
