


const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

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
    password: {
        type: String,

        required: [true, "user must provide password"],

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
    },
    socket_id: {
        type: String
    },
    friends: [
        {
            type: mongoose.mongo.ObjectId,
            ref: "User"
        }
    ],
    communicatingFriends: [
        {
            type: mongoose.mongo.ObjectId,
            ref: "User"
        }
    ],
    status: {
        type: String,
        enum: ["Online", "Offline"]
    }

})


userSchema.methods.correctPass = async function (password, userPassword) {
    {
        return await bcrypt.compare(password, userPassword)
    }
}

userSchema.methods.chagedPassword = function (time) {
    if (this.passwordChanged) {

        let timeChanged = this.passwordChanged.getTime() / 1000;

        return time < timeChanged
    }
    return false;
}


userSchema.pre('save', async function (next) {


    if (!this.isModified('password')) {
        // console.log("in");
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);
    next()
})



// creating model 
const User = mongoose.model("User", userSchema);

module.exports = User

















