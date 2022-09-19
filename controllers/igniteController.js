const axios = require('axios')
const Story = require('../models/Story')
const cloudinary = require("../middleware/cloudinary")

//Get/
//homepage

module.exports = {

homepage : async(req, res) => {
    try{
        const limitNumber = 5
        const latest = await Story.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('dashboard', {title: "Ignite Writing- Home", latest})  
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    } 
},

//Get/ shared-stories
//Show the errors/success & render the page. 
sharedStories : async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    res.render('shared-stories', {title: "Ignite Writing- Shared Stories", infoSubmitObj,infoErrorsObj})
},

//POST/ Submit-Stories
submitStoryOnPost : async(req, res) => {

    try{
        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path)

        await Story.create({
            name: req.body.name,
            email: req.body.email,
            title: req.body.title,
            description: req.body.description,
            grade: req.body.grade,
            file: result.secure_url,
            cloudinaryId: result.public_id,
            date: req.body.date,
            // user: req.user.id
        })

        req.flash('infoSubmit', 'Story has been added')
        res.redirect('/shared-stories')
    }catch(error){
        console.log(error)
        req.flash('infoErrors', error)
        res.redirect('/shared-stories')
    }
},

//explore latest-Get

exploreLatest : async(req, res) =>{

    try{
        const limitNumber = 10
        const story = await Story.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('explore-latest', {title: 'Ignite Writing-Explore Latest', story})
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},

// Get- Read story written by a kid
readStory : async(req, res) => {
    try {
        const storyId = req.params.id
        const story = await Story.findById(storyId)
        res.render('story', {title: 'Ignite Writing-Read a story', story})
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},

// Put- Like a story
storyLike : async(req, res) =>{
    let storyId = req.body.IdFromJSFile
    try {
        await Story.findOneAndUpdate({_id: storyId},{
            like: true
        })
        console.log('Marked Like', storyId)
        res.json('Marked Like')
        // res.render('story', {like: true})
    } catch (error) {
        console.log(error)
    }
},

//Put- Not Like a story
notLikeStory : async(req, res) => {
    let storyId = req.body.IdFromJSFile
    try {
        let markItem = await Story.findOneAndUpdate({_id: storyId},{
            like: false
        })
        console.log('Marked not like', markItem, storyId)
        res.json('Marked not like')
    } catch (error) {
        console.log(error)
    }
},

// Get -Render the Reading page. 
readABook : async(req, res) => {
    try {
        res.render('reading', {title: "Read a Book Google API"})
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},

// Read a book from the Google API database
findABooksOnPost : async(req,res) => {
    try {
        const searchTerm = req.body.searchTerm
        let bookAPI = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}:keyes&key=${APIKEY}`)
        let books = bookAPI.data
        res.render('reading-results', {books: books})
        console.log(books)
    } catch (error) {
        if(error.reponse){
            res.render('reading-results', {books: null})
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        }else if(error.request){
            res.render('reading-results', {books: null})
            console.log(error.request)
        }else{
            res.render('reading-results', {books: null})
            console.error('Error', error.message)
            res.status(500).send({message: error.message || "Error Occurred"})
        }
    }
},

//Click a book and read it. 
readABookOnClick : async(req,res) => {
    let bookID = req.params.ISBN
    let book = bookID
    try {
        res.render('book', {book: book})
        console.log(book)
    } catch (error) {
        if(error.reponse){
            res.render('book', {book: null})
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        }else if(error.request){
            res.render('book', {book: null})
            console.log(error.request)
        }else{
            res.render('book', {book: null})
            console.error('Error', error.message)
            res.status(500).send({message: error.message || "Error Occurred"})
        }
    }
},


}
//Insert Story to Database
// async function insertDymmyStoryData(){
//     try{
//         await Story.insertMany([
//             {
//             "name": "Mary Smith",
//             "email": "mary.smith@gmail.com",
//             "title": "Play Time", 
//             "description": "Maria meets friends.",
//             "grade": "2nd Grade",
//             "file" : "mariaStory.png",
//             "date": "12/05/2021"
//             },
//             {
//             "name": "Shira", 
//             "email": "shira@gmail.com",
//             "title": "Dreams", 
//             "description": "Keep your dreams alive.",
//             "grade": "3rd Grade",
//             "file" : "shiraStory.png",
//             "date": "1/20/2022"
//             },
//             {
//             "name": "Michael", 
//             "email": "michael@gmail.com",
//             "title": "Rabbit", 
//             "description": "I try asking mom for a pet.",
//             "grade": "5th Grade",
//             "file" : "michaelStory.png",
//             "date": "3/26/2022"
//             },
//             {
//             "name": "Dave", 
//             "email": "dave@gmail.com",
//             "title": "4th Grade", 
//             "description": "Why I like 4th grade",
//             "grade": "4th Grade",
//             "file" : "daveStory.png",
//             "date": "6/13/2022"
//             },
//             {
//             "name": "Sylvia", 
//             "email": "sylvia@gmail.com",
//             "title": "The Queen", 
//             "description": "Story about a queen",
//             "grade": "1st Grade",
//             "file" : "sylviaStory.png",
//             "date": "10/27/2021"
//             },

//         ])
//     }catch(error){
//         console.log('err', + error)
//     }
// }

//insertDymmyStoryData()