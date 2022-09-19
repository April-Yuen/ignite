// Require Dependencies
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const axios = require('axios')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
const storyRoutes = require('./routes/stories')
const mainRoutes = require('./routes/main')


const app = express()

require("dotenv").config({path: './config/.env'})

// Connecting to the database
connectDB()

//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.json())
app.use(expressLayouts)
app.use(cors())

app.use(cookieParser('IgniteAppSecure'))
app.use(session({
    secret: "IgniteAppSecretSession",
    saveUninitialized: false, 
    resave: false,
    store: MongoStore.create({mongoUrl: process.env.MONGODB_URI})
}))
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})
app.use(flash());

app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

const { default: mongoose } = require('mongoose')
app.use('/', mainRoutes)
app.use('/stories', storyRoutes)



//Connected to Port
app.listen(process.env.PORT, ()=>{
    console.log(`Server is running better catch it!`)
})

