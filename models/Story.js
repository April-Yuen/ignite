const mongoose = require('mongoose')

const storySchema = new mongoose.Schema({
    name: {
        type: String,
        required: "This field is required."
    }, 
    email: {
        type: String,
        required: "This field is required."
    }, 
    title: {
        type: String, 
        required: false
    },
    description: {
        type: String, 
        required: false
    },
    grade: {
        type: String, 
        required: false
    },
    file: {
        type: String,
        require: true
    },
    cloudinaryId: {
        type: String,
        required: true,
    },
    date: {
        type: Date, 
        required: true, 
        default: Date.now
    },
    like: {
        type: Boolean,
        required: true,
        default: false
    },
    likesBy: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Story", storySchema)