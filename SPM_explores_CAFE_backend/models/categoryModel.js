const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_id: {
        type: String,
        unique: true,
        trim: true,
        require: true
    },
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        require: true
    },
    images: {
        type: Object,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Category", categorySchema)