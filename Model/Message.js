


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    user1: {
        type: mongoose.mongo.ObjectId,
        ref: 'User',
        required: [true, "message must belong to specific user first"]
    },
    user2: {
        type: mongoose.mongo.ObjectId,
        ref: 'User',
        required: [true, "message must belong to specific user second "]

    },
    chats: {
        type: mongoose.mongo.ObjectId,
        ref: 'OneToOneMessage',


    }

})



// creating model 
const Message = mongoose.model("Message", messageSchema);

module.exports = Message

















