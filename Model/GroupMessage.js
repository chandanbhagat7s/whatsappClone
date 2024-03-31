


const mongoose = require('mongoose');

const groupMsgSchema = new mongoose.Schema({
    ofGroup: {
        type: mongoose.mongo.ObjectId,
        required: [true, "created message should have group id"]
    },
    msg: {
        type: [Object]
    }

})



// creating model 
const GroupMessage = mongoose.model("GroupMsg", groupMsgSchema);

module.exports = GroupMessage;

















