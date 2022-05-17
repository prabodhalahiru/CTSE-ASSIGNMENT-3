const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
        trim: true
    },

    email: {
        type: String,
        required: true,
        //required: [true, 'Email field is required'],
    
        unique: true
    },

    password: {
        type: String,
        required: true,
        trim: true
        //trim is used to know created time and date
    }, 
    role: {
        type: Number,
        default:0
    },

    mobile: {
        type: Number,
        default:0
    },
    cart:{
        type: Array,
        default:[]
    }


},{
    //using timestamps we can know created time and date
    //test 4
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)