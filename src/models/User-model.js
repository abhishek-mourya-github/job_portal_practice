const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        index: true 
    },
    email : {
        type : String,
        required : true,
        trim : true,
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        enum : ["admin", "recruiter", "seeker"],
        default : "seeker"
    }
})

const User = mongoose.model("User", userSchema);
module.exports = User;