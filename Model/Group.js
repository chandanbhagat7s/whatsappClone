const mongoose = require('mongoose');


const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, "grop must have a group name"]
    },
    groupBio: {
        type: String,
        required: [true, "grop must have a bio"]

    },
    members: {
        type: [mongoose.mongo.ObjectId]

    },
    admins: {
        type: [mongoose.mongo.ObjectId]

    },
    chats: {
        type: mongoose.mongo.ObjectId,
        ref: 'GroupMsg',


    },
    photo: String

})


const Groups = mongoose.model("Group", groupSchema)

module.exports = Groups;












