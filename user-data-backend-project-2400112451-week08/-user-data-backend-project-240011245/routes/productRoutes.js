/* FILE: ROUTES/PRODUCTROUTES.JS */
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/authMiddleware');


// 1. LẤY DANH SÁCH SẢN PHẨM (Public - Ai cũng xem được)
// GET /api/v1/products
// Hỗ trợ: lọc, sắp xếp, chọn trường, phân trang
router.get('/', async (req, res) => {
    try {
        // ==== 1. LỌC (FILTERING) ====
        // Sao chép query gốc
        const queryObj = { ...req.query };

        // Các field dùng cho chức năng khác, không dùng để lọc
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // Chuyển các toán tử so sánh sang dạng MongoDB: gte, gt, lte, lt → $gte, $gt...
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Khởi tạo query
        let query = Product.find(JSON.parse(queryStr));

        // ==== 2. SẮP XẾP (SORTING) ====
        if (req.query.sort) {
            // ?sort=price,name  → "price name"
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            // Mặc định: sắp xếp theo ngày tạo, mới nhất lên đầu
            query = query.sort('-createdAt');
        }

        // ==== 3. CHỌN TRƯỜNG (FIELD LIMITING) ====
        if (req.query.fields) {
            // ?fields=name,price  → "name price"
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        } else {
            // Mặc định: ẩn trường __v
            query = query.select('-__v');
        }

        // ==== 4. PHÂN TRANG (PAGINATION) ====
        // ?page=2&limit=10
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 10;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);

        // ==== 5. THỰC THI QUERY ====
        const products = await query;

        res.status(200).json({
            count: products.length,
            page,
            data: products
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 2. TẠO SẢN PHẨM (Admin only)
// POST /api/v1/products
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            data: newProduct
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// 3. XÓA SẢN PHẨM (Admin only)
// DELETE /api/v1/products/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).json({});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
