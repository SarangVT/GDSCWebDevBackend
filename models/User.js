const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique:true,
    },
    username:{
        type:String,
        required:true,
        unqiue:true,
    },
    password:{
        type:String,
        required:true,
    }
},{timestamps:true});


const User = model("users",userSchema);
module.exports = User;