

const express = require('express');
const app = express()
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./Routes/userRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const globalerrorHandler = require('./utils/globalerrorHandler');

//access to env variable
dotenv.config({ path: './config.env' });
const PORT = process.env.PORT

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


// defining routes
app.use('/api/v1/users', userRouter)


// starting the server
app.listen(PORT, () => {
    console.log("app stated running at port ", PORT);
})
app.use(globalerrorHandler)

















