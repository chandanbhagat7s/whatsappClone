

const express = require('express');
const app = express()
const dotenv = require('dotenv');
const cloudinary = require('cloudinary');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const globalerrorHandler = require('./utils/globalerrorHandler');

//access to env variable
dotenv.config({ path: './config.env' });


// database connection 
mongoose.connect(process.env.DATABASE)
    .then((con) => {
        // console.log(con.connection);
        console.log("database connected");
    }).catch(e => {
        console.log("database not connected");

    })




app.use(express.json({ limit: "10kb" }))
// using cookie parser to get the access in node app
app.use(cookieParser())

// to know what the request parameter
app.use(morgan("dev"))


//  for uploading files
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});




// defining routes
app.use('/api/v1/users', userRouter)
app.all('*', (req, res) => {
    console.log("not found");
})

// starting the server
module.exports = app;

















