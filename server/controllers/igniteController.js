require('../models/database')
const axios = require('axios')
const Story = require('../models/Story')

//Get/
//homepage

exports.homepage = async(req, res) => {
    try{
        const limitNumber = 5
        const latest = await Story.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('index', {title: "Ignite Writing- Home", latest})  
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    } 
}

//Get/ shared-stories
//Show the errors/success & render the page. 
exports.sharedStories = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors')
    const infoSubmitObj = req.flash('infoSubmit')
    res.render('shared-stories', {title: "Ignite Writing- Shared Stories", infoSubmitObj,infoErrorsObj})
}

//POST/ Submit-Stories
exports.submitStoryOnPost = async(req, res) => {

    try{

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No files were uploaded.')
        }else{
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
            imageUploadFile.mv(uploadPath, function(err){
                if(err) return res.status(500).send(err)
            })
        }
        const newStory = new Story({
            name: req.body.name,
            email: req.body.email,
            title: req.body.title, 
            description: req.body.description,
            grade: req.body.grade,
            file: newImageName,
            date: req.body.date
        })
        await newStory.save()

        req.flash('infoSubmit', 'Story has been added')
        res.redirect('/shared-stories')
    }catch(error){
        req.flash('infoErrors', error)
        res.redirect('/shared-stories')
    }
}

//explore latest-Get

exports.exploreLatest = async(req, res) =>{

    try{
        const limitNumber = 10
        const story = await Story.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('explore-latest', {title: 'Ignite Writing-Explore Latest', story})
    }catch(error){
        res.status(500).send({message: error.message || "Error Occurred"})
    }
}

// Get- Read story written by a kid
exports.readStory = async(req, res) => {
    try {
        const storyId = req.params.id
        const story = await Story.findById(storyId)
        res.render('story', {title: 'Ignite Writing-Read a story', story})
    } catch (error) {
        res.status(500).send({message: error.message || "Error Occurred"})
    }
}

// Put- Like a story
exports.storyLike = async(req, res) =>{
    try {
        await Story.findOneAndUpdate({_id: req.body.IdFromJSFile}),{
            like: true
        }
        console.log('Marked Like')
        res.json('Marked Like')
    } catch (error) {
        console.log(error)
    }
}

// Put- Not Like a story
exports.storyNotLike = async(req, res) => {
    try {
        await Story.findOneAndUpdate({_id: req.body.IdFromJSFile}),{
            like: false
        }
        console.log('Marked not like')
        res.json('Marked not like')
    } catch (error) {
        console.log(error)
    }
}

// Get -Render the Reading page. 
exports.readABook = async(req, res) => {
    try {
        const searchTerm = req.params.searchTerm
        let bookAPI = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}:keyes&key=${APIKEY}`)
        res.render('reading', {books: bookAPI.data})
        console.log(books)
    } catch (error) {
        if(error.reponse){
            res.render('reading', {books: null})
            console.log(error.response.data)
            console.log(error.response.status)
            console.log(error.response.headers)
        }else if(error.request){
            res.render('reading', {books: null})
            console.log(error.request)
        }else{
            res.render('reading', {books: null})
            console.error('Error', error.message)
            res.status(500).send({message: error.message || "Error Occurred"})
        }
    }
}

// Read a book from the Google API database
exports.findABooksOnPost = async(req,res) => {
    try {
        const searchTerm = req.body.searchTerm
        let bookAPI = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}:keyes&key=${APIKEY}`)
        res.render('reading-results', {books: bookAPI.data})
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