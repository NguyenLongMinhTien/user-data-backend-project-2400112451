// FILE: routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

/* CREATE PRODUCT */
router.post('/', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            message: "Product created successfully",
            data: product
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/* FILTER */
router.get('/filter', async (req, res) => {
    try {
        console.log("RAW QUERY:", req.query);

        let queryObj = {};

        // Trường hợp Express parse đúng:  price: { gte: '5000' }
        if (req.query.price) {
            const condition = {};

            if (req.query.price.gte) condition.$gte = Number(req.query.price.gte);
            if (req.query.price.gt) condition.$gt = Number(req.query.price.gt);
            if (req.query.price.lte) condition.$lte = Number(req.query.price.lte);
            if (req.query.price.lt) condition.$lt = Number(req.query.price.lt);

            queryObj.price = condition;
        }

        // Trường hợp Express parse sai: "price[gte]": "5000"
        Object.keys(req.query).forEach(key => {
            if (key.includes('price[')) {
                const operator = key.match(/price\[(.*)\]/)[1]; // gte, lte...
                const mongoOp = `$${operator}`;
                queryObj.price = { ...queryObj.price, [mongoOp]: Number(req.query[key]) };
            }
        });

        console.log("FINAL MONGO FILTER:", queryObj);

        const products = await Product.find(queryObj);

        res.status(200).json({
            count: products.length,
            data: products
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


/* SORT */
router.get('/sort', async (req, res) => {
    try {
        let sortBy = '-createdAt';
        if (req.query.sort) {
            sortBy = req.query.sort.split(',').join(' ');
        }

        const products = await Product.find().sort(sortBy);

        res.status(200).json({
            count: products.length,
            sortBy: sortBy,
            data: products
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* FIELDS */
router.get('/fields', async (req, res) => {
    try {
        let fields = '-__v';
        if (req.query.fields) {
            fields = req.query.fields.split(',').join(' ');
        }

        const products = await Product.find().select(fields);

        res.status(200).json({
            fields: fields,
            count: products.length,
            data: products
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* PAGINATION */
router.get('/pagination', async (req, res) => {
    try {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 5;
        const skip = (page - 1) * limit;

        const products = await Product.find().skip(skip).limit(limit);

        res.status(200).json({
            page: page,
            limit: limit,
            count: products.length,
            data: products
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
