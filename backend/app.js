const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cloudinary = require('cloudinary');
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser'); 
const errorMiddleware = require('./middleware/errors');
app.use(express.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(fileUpload());
//setting cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const products = require('./routes/product');
const auth = require('./routes/auth'); 
const order = require('./routes/order');
const bodyParser = require('body-parser');
//Import all routes

 
app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1', order)
//middelware handle error
app.use(errorMiddleware);
module.exports = app
