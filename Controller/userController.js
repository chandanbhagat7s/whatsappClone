


// get all users 
// we are sending the users which are not our friends (the remeaning ones)

const Groups = require("../Model/Group");
const Message = require("../Model/Message");
const OneToOneMessage = require("../Model/OneToOneMessage");
const Request = require("../Model/Request");
const User = require("../Model/User");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find({}).select("userName _id bio")
    console.log(users);

    const this_user = req.user;
    const remaining_users = users.filter((eachUser) => {
        return !this_user.friends.includes(eachUser._id) && req.user._id.toString() !== eachUser._id.toString()
    })

    res.status(200).send({
        status: true,
        remaining_users,
        message: "Users Found Successfully"
    })




})


exports.getFriendList = catchAsync(async (req, res, next) => {

    const currestUser = await User.findById(req.user._id).populate("friends", "userName _id ");

    res.status(200).send({
        status: true,
        message: "Friends List searched successfully",
        data: currestUser.friends
    })
})


exports.getFriendListDataConversion = catchAsync(async (req, res, next) => {

    const currestUser = await User.findById(req.user._id).populate("friends", "userName _id ");

    res.status(200).send({
        status: true,
        message: "Friends List searched successfully",
        data: currestUser.friends
    })
})


exports.getMsgList = catchAsync(async (req, res, next) => {

    const msgs = await Message.find({
        $or: [{ user1: req.user._id }, { user2: req.user._id }]
    }).populate("user1 user2 chats")



    res.status(200).send({
        status: true,
        message: "msg List searched successfully",
        data: msgs
    })
})







exports.getAllFriendRequest = catchAsync(async (req, res, next) => {
    const requests = await Request.find({ recipient: req.user._id }).populate("sender", "userName _id")


    res.status(200).send({
        status: true,
        message: "Friend Request List searched successfully",
        data: requests
    })
})


exports.createGroup = catchAsync(async (req, res, next) => {
    const { groupName, groupBio, members, admins, chats } = req.body;
    if (!groupName || !groupBio || !members || !admins || !chats) {
        return next(new appError("please provide all the details to create a group", 400))
    }
    const group = await Groups.create({
        groupName, groupBio, members, admins, chats
    })


    res.status(200).send({
        status: true,
        message: "Friend Request List searched successfully"
    })
})





















