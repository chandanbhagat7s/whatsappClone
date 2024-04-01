


// get all users 
// we are sending the users which are not our friends (the remeaning ones)


const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs');
const cloudinary = require('cloudinary');

const Groups = require("../Model/Group");
const GroupMessage = require("../Model/GroupMessage");
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







exports.everyone = catchAsync(async (req, res, next) => {
    let users = await User.find({ _id: { $ne: req.user._id } }).select("userName _id bio")




    res.status(200).send({
        status: true,
        users,
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




exports.getMsgListGroup = catchAsync(async (req, res, next) => {

    console.log(
        "REQUEST PARAM", req.params
    );
    const msgs = await GroupMessage.find({ ofGroup: req.params.groupID })

    console.log(msgs);


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
    const { groupName, groupBio, members, admins } = req.body;
    console.log(req.body);
    if (!groupName || !groupBio || !members || !admins) {
        return next(new appError("please provide all the details to create a group", 400))
    }
    const group = await Groups.create({
        groupName, groupBio, members, admins
    })

    await GroupMessage.create({
        ofGroup: group._id,

    })


    res.status(200).send({
        status: true,
        message: "Friend Request List searched successfully",
        group
    })
})





exports.giveAllGroupUser = catchAsync(async (req, res, next) => {
    console.log("users id is ", req.user._id);
    const groups = await Groups.find({
        members: { $in: req.user._id }
    }).populate('chats')



    res.status(200).send({
        status: true,
        groups
    })
})


exports.getAllGroupsDetail = catchAsync(async (req, res, next) => {

    if (!req.params.groupID) {
        return next(new appError("please provide all the details to information group", 400))
    }
    const group = await Groups.find({
        members: { $contains: req.user._id }
    }).populate("chats")


    res.status(200).send({
        status: true,
        message: "Friend Request List searched successfully",
        group
    })
})







// image related operation 

// now we will decrease the quality and perform many operation 
const multerStorage = multer.memoryStorage();




exports.saveImageDisk = catchAsync(async (req, res, next) => {
    console.log("file is ", req.files);
    if (!req.files.data) {
        return next(new appError("please upload a file", 400))
    }




    // images
    console.log("IN DISK ", req.files);
    req.body.data = []
    req.files.data &&
        await Promise.all(req.files.data.map(async (el, i) => {
            const parts = el.originalname.split('.');

            // Take the last element of the array, which represents the file extension
            const extension = parts[parts.length - 1];
            const fileName = `${req.user._id}-${i}-${Date.now()}.${extension}`
            await sharp(el.buffer).toFile(`./pubic/${fileName}`)
            req.body.data.push(fileName)
        }))
    console.log("exit");

    next()


})




const upload = multer({
    storage: multerStorage,
});
// exports.uploadFilesBtn = upload.array('data', 10)
exports.uploadFilesBtn = upload.fields([{ name: 'data', maxCount: 20 }])


exports.submitFile = catchAsync(async (req, res, next) => {
    console.log(req.files);
    let sendingData = [];
    let result;
    if (req.files) {

        try {
            req.body.data.map(async (el, i) => {
                result = await cloudinary.v2.uploader.upload(`pubic/${el}`, {
                    folder: 'cloudFiles',
                });
                console.log(result);


                if (result) {
                    // Set the public_id and secure_url in DB
                    sendingData.push(result.url)

                }
                if (req.body.data.length == (i + 1)) {


                    res.status(200).send({
                        status: true,
                        sendingData
                    })
                }
            })


        } catch (error) {
            console.log("error", error);
            res.status(200).send({
                status: false,

            })
        }
    }


})













