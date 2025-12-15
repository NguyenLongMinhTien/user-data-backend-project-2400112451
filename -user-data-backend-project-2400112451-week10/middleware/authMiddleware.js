/*
* ========================================
* FILE: MIDDLEWARE/AUTHMIDDLEWARE.JS
* MÔ TẢ: Middleware để kiểm tra Token (JWT) và Phân quyền
* ========================================
*/

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Model User

// --- 1. MIDDLEWARE: BẢO VỆ (PROTECT) ---
exports.protect = async (req, res, next) => {
    let token;

    // 1. Kiểm tra header Authorization có tồn tại và bắt đầu bằng "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // 2. Lấy token
            token = req.headers.authorization.split(" ")[1];

            // 3. Xác minh token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Tìm User theo id trong payload token
            req.user = await User.findById(decoded.id).select("-password");

            // 5. Cho đi tiếp
            return next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({
                message: "Không có quyền truy cập, token không hợp lệ"
            });
        }
    }

    // 6. Nếu không có token
    if (!token) {
        return res.status(401).json({
            message: "Không có quyền truy cập, không tìm thấy token"
        });
    }
};


// --- 2. MIDDLEWARE: PHÂN QUYỀN ---
exports.authorize = (...roles) => {
    return (req, res, next) => {

        // Middleware này chạy sau protect ⇒ req.user phải có
        if (!req.user) {
            return res.status(401).json({
                message: "Lỗi không xác định được người dùng"
            });
        }

        // Kiểm tra vai trò
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Vai trò '${req.user.role}' không có quyền thực hiện chức năng này`
            });
        }

        next();
    };
};
