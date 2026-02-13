const express = require("express");
const mongoose = require("mongoose");
const expressLayout = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
require('dotenv').config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }))
app.use(express.static('public'))
app.use(cookieParser());
app.use(expressLayout);
app.set('layout','layout');

//view engin
app.set('view engine', 'ejs')

// database connection
mongoose.connect(process.env.MONGODB_URL);

// routes
app.use('/admin',(req,res,next)=>{
    res.locals.layout = 'admin/layout';
    next();
})
app.use('/admin', require('./routes/backend'));

app.use('/', require('./routes/frontend'));

app.listen(3000,()=>{
    console.log("server connect successfully");
})