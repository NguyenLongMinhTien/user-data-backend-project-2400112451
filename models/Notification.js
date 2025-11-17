
const mongoose = require('mongoose');
const notificationSchema = new mongoose. Schema({
// Tham chiếu: Liên kết đến User nhận thông báo
    user: {
        type: mongoose.Schema. Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Nội dung thông báo
    message: {
        type: String,
        required: true
    },

    // Trạng thái đã đọc (quan trọng cho UI)
    isRead: {
        type: Boolean,
        default: false
    },
    
    // Loại thông báo (để lọc hoặc hiển thị icon khác nhau)
    type: {
        type: String,
        enum: ['order_status', 'new_product', 'security_alert', 'system'],
        default: 'system'
    },
    
    // Ghi chú: (Tùy chọn) Đường link khi nhấn vào thông báo
    link: {
        type:
        String,
        trim: true
    }
}, { timestamps: true }); // Dùng createdAt để sắp xếp thông báo theo thứ tự mới nhất
// GHi chú: Tổối ưu Tốc độ Đọc
// Tạo một Index (chỉ mục) trên trường 'user' và 'createdAt'.
// Điều này giúp tăng tốc độ truy vấn "Lấy tất cả thông báo của user X, sắp xếp theo ngày tạo".
notificationSchema.index({user: 1, createdAt: -1});

module.exports = mongoose.model('Notification', notificationSchema);