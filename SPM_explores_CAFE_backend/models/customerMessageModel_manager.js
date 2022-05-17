const mongoose = require('mongoose')

const customerMessageSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("UserMesseage", customerMessageSchema)