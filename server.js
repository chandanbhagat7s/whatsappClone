const app = require("./app");
const http = require("http");



const { Server } = require("socket.io");
const globalerrorHandler = require("./utils/globalerrorHandler");
const User = require("./Model/User");
const Request = require("./Model/Request");
const OneToOneMessage = require("./Model/OneToOneMessage");
const Message = require("./Model/Message");
const Groups = require("./Model/Group");

// created server
const server = http.createServer(app)


// now we are creating server instance
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

// now we are going to listen for the events
// -- whenerver the  client login will triger this event connnection  from frontend 
io.on("connection", async (socket) => {
    // we will be sending this parameter which we are getting hear form client side
    // console.log(socket);
    const user_id = socket.handshake.query.user_id;
    console.log(user_id);

    // then we need the( socket id ) for emitting the events to that client then we need to store that socket id in the users doc
    const socket_id = socket.id;
    console.log(socket_id);
    if (user_id) {
        await User.findByIdAndUpdate(user_id, {
            socket_id,
            status: "Online"

        })
    }


    // we can write hear event listners hear for socket
    socket.on("friend_request", async (data) => {
        // {to:... from:....}
        console.log("CAME O INTO FR");

        console.log("incoming dat ais ", data);
        const to = await User.findById(data.to)
        const from = await User.findById(data.from)

        console.log("to", to);
        console.log("from", from);

        const finded = await Request.find({
            sender: data.from,
            recipient: data.to
        })
        console.log("data of ", finded);
        if (finded.length > 0) {
            io.to(from.socket_id).emit("request_sent", {
                message: "friend request already sent"

            })
            return
        }

        // createing the friend request
        await Request.create({
            sender: data.from,
            recipient: data.to
        })

        // creating event new_friend_request
        io.to(to.socket_id).emit("new_friend_request", {
            message: "new Friend request"
        })
        // creating event new_friend_request sent
        io.to(from.socket_id).emit("request_sent", {
            message: "Friend request sent"

        })






    })


    // for accepting request
    socket.on("accept_request", async (data) => {
        // in data we are going to get the request id 
        console.log(data);
        const request = await Request.findById(data.request_id)


        // we are getting both the document 
        const sender = await User.findById(request.sender)
        const reciver = await User.findById(request.recipient)

        // now we need to update both the friend list , add each other in each other's list
        sender.friends.push(reciver._id)
        reciver.friends.push(sender._id)


        // now we need to save both the documnet
        await sender.save({ new: true, validateModifiedOnly: true })
        await reciver.save({ new: true, validateModifiedOnly: true })

        // now we need to delte the request document 
        await Request.findByIdAndDelete(data.request_id)

        // now we need to triger the event to  both of them 

        io.to(sender.socket_id).emit("request_accepted", {
            message: "Friend request is accepted"
        })
        io.to(reciver.socket_id).emit("request_accepted", {
            message: "Friend request is accepted"
        })


    })

    // create new convertion
    socket.on("create_new_convertion", async (data) => {
        // in data we are going to get the request id 
        console.log(data);



        // we are getting both the document 
        const sender = await User.findById(data.sender)
        const reciver = await User.findById(data.reciver)


        if (sender.communicatingFriends.length > 0) {
            let cross = false;
            sender.communicatingFriends.map(el => {
                if (el.toString() == reciver._id) {
                    console.log("already communicating");
                    cross = true
                }

            })
            if (cross) {
                return
            }
        }



        // creating new chat
        let d = new Date();
        const msgTime = [d.getDate(), d.getMonth(), d.getFullYear(), `${d.getHours()}-${d.getMinutes()}`]
        const chat = await OneToOneMessage.create({
            msg: {
                by: data.sender,
                type: "text",
                reaction: "",
                time: msgTime,
                message: "hii",
                seen: false
            }
        })


        // now creating the message 
        await Message.create({
            user1: data.sender,
            user2: data.reciver,
            chats: chat._id

        })
        await User.findByIdAndUpdate(sender._id, {
            $push: { communicatingFriends: reciver._id }
        })


        await User.findByIdAndUpdate(reciver._id, {
            $push: { communicatingFriends: sender._id }
        })




        // sending the message       
        io.to(reciver.socket_id).emit("reseved_message", {
            message: `hii : ${sender.userName}`,
            by: data.sender
        })


    })


    socket.on("mark_all_seen", async (data) => {
        // in data we are going to get the request id 
        console.log("came into seenn");
        console.log("data is ", data);



        // we are getting both the document 
        const s = await User.findById(data.sender)
        const r = await User.findById(data.resever)






        const doc1 = await Message.find({
            user1: data.sender, user2: data.resever
        })
        const doc2 = await Message.find({
            user1: data.resever, user2: data.sender
        })
        const finalDoc = doc1.length > 0 ? doc1 : false || doc2.length > 0 ? doc2 : false;





        const updated = await OneToOneMessage.findById(finalDoc[0].chats.toString())

        // console.log(updated);
        let change = false;
        let updatedSenn = updated.msg.map((el) => {

            if (!el.seen) {
                if (el.by == data.resever) {
                    change = true;
                    el.seen = true;
                }

            }
            return el;
        })
        // console.log(updatedSenn);
        // updated.msg = updatedSenn;
        // console.log(updated);

        const updatednew = await OneToOneMessage.findByIdAndUpdate(finalDoc[0].chats.toString(), {
            msg: updatedSenn
        })


        if (change) {
            io.to(r.socket_id).emit("seen_message", {

            })
        }

        // const dd = await updated.save()
        // console.log("data is ", dd);











    })
    socket.on("send_message", async (data) => {
        // in data we are going to get the request id 
        console.log("data is ", data);



        // we are getting both the document 
        const sender = await User.findById(data.sender)
        const reciver = await User.findById(data.resever)





        let d = new Date();
        const msgTime = [d.getDate(), d.getMonth(), d.getFullYear(), `${d.getHours()}:${d.getMinutes()}`]
        // creating new chat
        const chat = await OneToOneMessage.findByIdAndUpdate(data.communication, {

            $push: {
                msg: {
                    by: data.sender,
                    type: "text",
                    reaction: "",
                    time: msgTime,
                    message: data.message,
                    seen: false
                }
            }
        })








        // sending the message       
        io.to(reciver.socket_id).emit("reseved_message", {
            message: `${data.message} : ${sender.userName}`,
            by: data.sender
        })


    })



    socket.on("group_request", async (data) => {
        // {to:... from:.... group :...}


        console.log("incoming dat ais ", data);
        const to = await User.findById(data.to)
        const from = await User.findById(data.from)
        const group = await Group.findById(data.group)

        console.log("to", to);
        console.log("from", from);
        console.log("group", group);

        const finded = await Groups.find({
            members: { $contains: to._id }
        })
        console.log("data of ", finded);
        if (finded.length > 0) {
            io.to(from.socket_id).emit("request_sent", {
                message: "group memdber already added"

            })
            return
        }

        // add the member to group
        // await


        // creating event new_friend_request
        io.to(to.socket_id).emit("new_friend_request", {
            message: "You are added to group"
        })
        // creating event new_friend_request sent
        io.to(from.socket_id).emit("request_sent", {
            message: "User added to group"

        })






    })




    // disconnect 
    socket.on("end", async (data) => {
        if (data.user_id) {
            await User.findByIdAndUpdate(data.user_id, {
                status: "Offline"
            })
        }
        console.log("closing connection");
        socket.disconnect(0)
    })



})












const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log("app stated running at port ", PORT);
})
app.use(globalerrorHandler)