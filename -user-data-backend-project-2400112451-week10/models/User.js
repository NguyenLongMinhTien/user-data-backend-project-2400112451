
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose. Schema ({
    username:
    {
        type: String,
        required: [true, 'Username is required'], // Bắt buộc, kèm thông báo lỗi
        unique: true,
        trim: true, // Tự động xóa khoảng trắng
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email:
    {
        type: String,
        required: [true, 'Email is required'],
        unique:
        true,
        lowercase: true, // Tự động chuyển thành chữ thường
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
        // Kiểm tra định dạng email
    },
    // passwordHash:
    // {
    //     type: String,
    //     required: true,
    //     required: [true, 'PasswordHash is required'] // Sẽ sửa thành 'password' ở Tuần 7
    // }, // Nền tảng Bảo mật
    password:{
        type: String,
        require: [true,'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    },
    profile:
    {
        fullName:
            {
                type: String,
                default: '',
                trim: true
            },
        phone:
            {
                type: String,
                default: '',
                trim: true
            },
    },
    role: {
        type: String,
        enum: { // Chỉ cho phép các giá trị này
            values: ['user', 'admin'],
            message: '{VALUE} is not a supported role', // Thông báo lỗi
        },
        default: 'user'
    },
    // THAM CHIẾU MỐI QUAN HỆ 1-1: Liên kết Cart
    cart: {
        type:mongoose. Schema. Types.ObjectId,
        ref: 'Cart'
    },
    // Tham chiếu N-n: Mảng các Order IDs
    orders:
    [
        {
            type: mongoose. Schema. Types. ObjectId,
            ref: 'Order'
        }
    ],
    // Tham chiếu 1-1: Liên kết với Wishlist
    wishlist:
    {
        type: mongoose. Schema. Types. ObjectId,
        ref: 'Wishlist'
    },
}, {timestamps: true});

userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        return next ();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch(error) {
        next(error); // chuyen loi cho Mongoose
    }
});

module.exports = mongoose.model('User',userSchema);