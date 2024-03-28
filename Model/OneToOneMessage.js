const { mongo, default: mongoose } = require("mongoose");

const oneToOneMessageSchema = new mongoose.Schema({

    msg: {
        type: [Object]
    },

});


const OneToOneMessage = mongoose.model("OneToOneMessage", oneToOneMessageSchema)

module.exports = OneToOneMessage;


