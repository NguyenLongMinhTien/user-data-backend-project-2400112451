const mongoose = require('mongoose');

const catergorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Category', catergorySchema);