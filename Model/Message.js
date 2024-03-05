


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user1: {
        type: mongoose.mongo.ObjectId,
        required: [true, "message must belong to specific user first"]
    },
    user2: {
        type: mongoose.mongo.ObjectId,
        required: [true, "message must belong to specific user second "]

    },
    data: {
        type: [Object]

    }

})
/* 
 Object : {
    message : "abc",
    time : "9.20",
    status : "seen",
    reaction : "smile",
    preview : "message"
 }
 */


// creating model 
const Message = mongoose.model("Message", messageSchema);

module.exports = Message

















