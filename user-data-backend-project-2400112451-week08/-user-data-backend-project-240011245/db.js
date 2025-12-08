const mongoose = require('mongoose');
require('dotenv').config(); // Ghi chú: Đọc file .env

/**
 * Hàm connectDB: Kết nối ứng dụng với MongoDB Atlas (dùng MONGO_URI từ .env).
 * Hàm này xử lý try/catch và in ra trạng thái kết nối.
 */
const connectDB = async () => {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error('MONGO_URI is not provided to connectDB');
    }

    // Allow toggling insecure TLS for local debugging only:
    const insecureTls = process.env.MONGO_TLS_INSECURE === 'true';

    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // Keep socket/heartbeat defaults; add TLS options below when needed
    };

    if (insecureTls) {
        // WARNING: disables cert/hostname validation. For debugging only.
        options.tls = true;
        options.tlsAllowInvalidCertificates = true;
        options.tlsAllowInvalidHostnames = true;
        console.warn('⚠️  MONGO_TLS_INSECURE is true — TLS certificate validation is DISABLED (debug only).');
    }

    try {
        await mongoose.connect(uri, options);
        console.log('✅ MongoDB Connected Successfully!');
    } catch (err) {
        // Print full error for diagnosis then rethrow
        console.error('❌ MongoDB connected failed:', err);
        throw err;
    }
};

// ✅ SỬA LỖI: Export chính xác hàm connectDB
module.exports = connectDB;
