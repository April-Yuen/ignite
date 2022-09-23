const express = require('express')
const router = express.Router()
const igniteController = require('../controllers/igniteController')
const upload = require("../middleware/multer")

// App Routes

router.get("/dashboard", igniteController.homepage)
router.get('/shared-stories', igniteController.sharedStories)
router.post('/shared-stories', upload.single("file"), igniteController.submitStoryOnPost)
router.get('/explore-latest', igniteController.exploreLatest)
router.get('/story/:id', igniteController.readStory)
router.put('/storyLike', igniteController.storyLike)
router.put('/notLikeStory', igniteController.notLikeStory)
router.get('/reading', igniteController.readABook)
router.post('/searchBook', igniteController.findABooksOnPost)
router.get('/book/:ISBN', igniteController.readABookOnClick)

module.exports = router;