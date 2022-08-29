const express = require('express')
const router = express.Router()
const igniteController = require('../controllers/igniteController')

// App Routes

router.get("/", igniteController.homepage)
router.get('/shared-stories', igniteController.sharedStories)
router.post('/shared-stories', igniteController.submitStoryOnPost)
router.get('/explore-latest', igniteController.exploreLatest)
router.get('/story/:id', igniteController.readStory)
router.put('/storyLike', igniteController.storyLike)
router.put('/storyNotLike', igniteController.storyNotLike)
router.get('/reading', igniteController.readABook)
router.post('/searchBook', igniteController.findABooksOnPost)

module.exports = router;