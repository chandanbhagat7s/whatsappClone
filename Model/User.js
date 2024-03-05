


const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "user must have a username"],
        unique: [true, "the username already exits please try diffrent"]

    },
    email: {
        type: String,
        required: [true, "user must have a email"],
        unique: [true, "the user with this email already exits please try diffrent"]
    },
    phone: {
        type: String,
        required: [true, "user must provide mobile number"],
        unique: [true, "the user with this mobile number  already exits please try diffrent"]
    },
    age: {
        type: String,
        required: [true, "user must provide his/her age"],
    },
    bio: {
        type: String,
        required: [true, "user must provide his/her bio"],
    },
    photo: {
        type: String
    }

})

// creating model 
const User = mongoose.model("User", userSchema);

module.exports = User

















