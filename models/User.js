const mongoose = require("mongoose");
const mongoosePagination = require("mongoose-paginate-v2");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['author','admin'],
        default:'author',
        required:true
    }
});

userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 12);
    }
});

mongoose.plugin(mongoosePagination);

module.exports = mongoose.model('User', userSchema);