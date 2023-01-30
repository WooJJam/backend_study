const express = require('express');
const sqlController = require('../controllers/sql');
const router = express.Router();

router.post('/testingUser', sqlController.makeTestingUsers);
router.post('/testingPost', sqlController.makeTestingPosts);
router.get('/getPosts', sqlController.getPostData);
router.get('/search', sqlController.searchPostData);

module.exports = router;