// Require Dependencies
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const axios = require('axios')
const multer = require('multer')
const upload = multer({dest: './public/uploads/'})
const session = require('express-session')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const cookieParser = require('cookie-parser')

PORT = 2121
const app = express()

require('dotenv').config()

//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(expressLayouts)
app.use(cors())

app.use(cookieParser('IgniteAppSecure'))
app.use(session({
    secret: "IgniteAppSecretSession",
    saveUninitialized: true, 
    resave: true
}))
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
})
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

const routes = require('./server/routes/igniteRoutes.js')
app.use('/', routes)





//Connected to Port
app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

