const { default: mongoose } = require("mongoose");


const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.mongo.ObjectId,
        ref: "User"

    },
    recipient: {
        type: mongoose.mongo.ObjectId,
        ref: "User"

    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Request = mongoose.model("Request", requestSchema);
module.exports = Request;



