const express = require('express');
const router = express.Router();
const igniteController = require('../controllers/igniteController');
const upload = require("../middleware/multer");
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// App Routes

router.get("/dashboard", ensureAuth, igniteController.homepage);
router.get('/shared-stories', ensureAuth, igniteController.sharedStories);
router.post('/shared-stories', ensureAuth, upload.single("file"), igniteController.submitStoryOnPost);
router.get('/explore-latest', igniteController.exploreLatest);
router.get('/story/:id', igniteController.readStory);
router.put('/storyLike', ensureAuth, igniteController.storyLike);
router.put('/notLikeStory', ensureAuth, igniteController.notLikeStory);
router.get('/reading', igniteController.readABook);
router.post('/searchBook', igniteController.findABooksOnPost);
router.get('/book/:ISBN', igniteController.readABookOnClick);
router.get('/favorites', ensureAuth, igniteController.readFavorites);
router.get('/myStories', ensureAuth, igniteController.readMyStories);
router.delete('/deleteStory/:id', ensureAuth, igniteController.deleteStory);


module.exports = router;