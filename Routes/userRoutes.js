const express = require('express');
const { login, signUp } = require('../Controller/authController');
const { getAllFriendRequest, getAllUsers, getFriendList, getMsgList } = require('../Controller/userController');
const { getVerified } = require('../middleware/Protect');
const userRouter = express.Router()


userRouter.post('/login', login);
userRouter.post('/signup', signUp);
userRouter.use(getVerified)
userRouter.get('/getAllFriendRequest', getAllFriendRequest);
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/getFriendList', getFriendList);
userRouter.get('/getAllCommunication', getMsgList);

module.exports = userRouter;









