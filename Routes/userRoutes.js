const express = require('express');
const { login, signUp } = require('../Controller/authController');
const { getAllFriendRequest, getAllUsers, getFriendList, getMsgList, createGroup, getAllGroupsDetail, everyone, getFriendListDataConversion, giveAllGroupUser, getMsgListGroup, submitFile, uploadImages, uploadFilesBtn, saveImageDisk } = require('../Controller/userController');
const { getVerified } = require('../middleware/Protect');
const userRouter = express.Router()



userRouter.post('/login', login);
userRouter.post('/signup', signUp);
userRouter.use(getVerified)
userRouter.post('/createGroup', createGroup);
userRouter.get('/getAllGroupDetail/groupID', getAllGroupsDetail);
userRouter.get('/getAllFriendRequest', getAllFriendRequest);
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/getAllGroupsDetails', giveAllGroupUser);
userRouter.get('/everyone', everyone);
userRouter.get('/getFriendList', getFriendList);
userRouter.get('/getAllCommunication', getMsgList);


userRouter.post('/submitFile', uploadFilesBtn, saveImageDisk, submitFile);



// for files
// userRouter.post('/sendFiles',)




module.exports = userRouter;









