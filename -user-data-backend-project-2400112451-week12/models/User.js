const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'], // ❗ sửa require → required
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Không trả password khi query
    },

    profile: {
      fullName: {
        type: String,
        default: '',
        trim: true,
      },
      phone: {
        type: String,
        default: '',
        trim: true,
      },

      // ✅ Avatar URL (Cloudinary)
      avatarUrl: {
        type: String,
        default: '',
        trim: true,
      },
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Tham chiếu 1-1: Cart
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },

    // Tham chiếu N-n: Orders
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],

    // Tham chiếu 1-1: Wishlist
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wishlist',
    },
  },
  { timestamps: true }
);

/// ===============================
/// MIDDLEWARE: HASH PASSWORD
/// ===============================
userSchema.pre('save', async function (next) {
  // Chỉ hash khi password thay đổi
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', userSchema);
