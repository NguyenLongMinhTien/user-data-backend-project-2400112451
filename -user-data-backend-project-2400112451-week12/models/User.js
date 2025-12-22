const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

    // ==============================
    // Password reset token handling
    // ==============================
    // Token (hashed) used to verify password reset
    resetPasswordToken: {
      type: String,
      index: true,
      select: false,
    },
    // Expiration time for the reset token
    resetPasswordExpire: {
      type: Date,
      select: false,
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

/// ===============================
/// METHODS: CREATE RESET TOKEN
/// ===============================
/**
 * Generates a password reset token, stores its hashed value and expiry on the user document,
 * and returns the raw token for sending via email. The raw token should not be persisted.
 */
userSchema.methods.getResetPasswordToken = function () {
  // Create raw token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to schema
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire time (e.g., 10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
