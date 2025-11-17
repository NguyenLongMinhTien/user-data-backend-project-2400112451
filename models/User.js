const mongoose = require('mongoose');
// BƯỚC 1: Import bcryptjs
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Giữ nguyên username, email, profile, role, orders, wishlist, cart...
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,3}$/, 'Please enter a valid email address']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },

    profile: {
        fullName: {
            type: String,
            default: '',
            trim: true
        },
        phone: {
            type: String,
            default: '',
            trim: true
        }
    },

    role: {
        type: String,
        enum: {
            values: ['user', 'admin'],
            message: '{VALUE} is not a supported role'
        },
        default: 'user'
    },

    // THAM CHIẾU MỐI QUAN HỆ 1-1
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },

    // Mối quan hệ N-n
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],

    wishlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wishlist'
    }

}, { timestamps: true });

// Hook pre-save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
