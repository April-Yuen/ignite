const axios = require('axios')
const Story = require('../models/Story')
const User = require('../models/User')
const cloudinary = require("../middleware/cloudinary")
const APIKEY = process.env.GOOGLE_APIKEY


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
            user: req.user.id
        })

        req.flash('infoSubmit', 'Story has been added')
        res.redirect('/stories/shared-stories')
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
        res.render('story', {title: 'Ignite Writing-Read a story', story, user: req.user})
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
},

// Put- Like a story
storyLike : async(req, res) =>{
    let storyId = req.body.IdFromJSFile
    let userId = (req.user.id).toString()
    console.log(userId)
    try {
        let story = await Story.findById(storyId)

        let arr = story.likesBy

        arr.push(userId)

        await story.save()

        req.user.favorites.push(storyId)
        await req.user.save()

        console.log('Marked Like', storyId)
        res.json('Marked Like')
    } catch (error) {
        console.log(error)
    }
},

//Put- Not Like a story
notLikeStory : async(req, res) => {
    let storyId = req.body.IdFromJSFile
    try {
        let story = await Story.findById(storyId)

        story.likesBy = story.likesBy.filter(id => id.toString() !== req.user.id.toString())

        await story.save()

        req.user.favorites = req.user.favorites.filter( story => story != storyId)

        console.log(req.user.favorites)

        await req.user.save()

        console.log('Marked not like', storyId)
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

//Click a book and read it from the Google Books API. 
readABookOnClick : async(req,res) => {
    let bookID = req.params.ISBN
    let book = bookID
    try {
        res.render('book', {book: book})
        console.log(book)
    } catch (error) {
        if(error.response){
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

// Get-Read your favorite stories from other children
readFavorites : async(req,res) => {
    try {
        let stories = await Story.find();
        let favStories = stories.filter(story => req.user.favorites.includes(story.id))
        console.log(favStories)

        res.render('favorites', {title: 'Ignite Writing-Read Favorites', 
                                stories : favStories, 
                                name: req.user.userName})
    } catch (error) {
        res.status(500).send({message: error.message} || "Error Occurred")
    }
},
// Get-Read your own stories
readMyStories : async(req, res) => {
    try {
        const stories = await Story.find({user: req.user.id});
        res.render('myStories.ejs', {stories: stories, user: req.user, name: req.user.userName})
    } catch (error) {
        console.log(error)
    }
},

deleteStory : async(req, res) => {
    console.log("Hi")
    try {
        let story = await Story.findById({_id: req.params.id});
        console.log(story)
        await cloudinary.uploader.destroy(story.cloudinaryId);
        await Story.remove({_id: req.params.id});
        console.log("Deleted Post")
        res.redirect("/stories/myStories")
    } catch (error) {
        console.log(error)
        res.redirect("/stories/myStories")
    }
}


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