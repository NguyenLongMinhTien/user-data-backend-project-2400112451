const mongoose = require('mongoose');

const userSchema = new mongoose. Schema ({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true }, // Nền tảng Bảo mật

    profile: { fullName: { type: String, default: '' }, phone: { type: String, default:'' } },

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },

    // Tham chiếu N-n: Mảng các Order IDs
    orders: [{ type: mongoose. Schema.Types.ObjectId, ref: 'Order' }],
    // Tham chiếu 1-1: Liên kết với Wishlist

    wishlist: { type: mongoose.Schema. Types.ObjectId, ref: 'Wishlist' },

    role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);