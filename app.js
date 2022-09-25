// Require Dependencies
const express = require('express')
const app = express()
const mongoose = require("mongoose")
const expressLayouts = require('express-ejs-layouts')
const passport = require("passport")
const axios = require('axios')
const session = require('express-session')
// const flash = require('connect-flash')
const flash = require('express-flash')
const logger = require('morgan')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
// const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const storyRoutes = require('./routes/stories')
const mainRoutes = require('./routes/main')


// Use .env file in config folder
require("dotenv").config({path: "./config/.env"});

require("./config/passport")(passport);

// Connecting to the database
connectDB()

// Using EJS for views
app.set('view engine', 'ejs')

// Static Folders
app.use(express.static('public'))

// Middleware
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json())

// Logging
app.use(logger("dev"));

app.use(expressLayouts)
app.use(cors())

// app.use(cookieParser('IgniteAppSecure'))
app.use(session({
    secret: "IgniteAppSecretSession",
    saveUninitialized: false, 
    resave: false,
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI})
    })
);

// app.use((req, res, next) => {
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// })

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Static folders and layouts
app.set('layout', './layouts/main')

// const { default: mongoose } = require('mongoose')
app.use('/', mainRoutes)
app.use('/stories', storyRoutes)



//Connected to Port
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running better catch it!`)
})

