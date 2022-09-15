'use strict'
const express = require('express');
// get root of app directory with path module.
const {dirname} = require('path');
const appDir = dirname(require.main.filename);

// get mysql connection
const {GetPostById} = require('../model/mysqlconnection');
// get utilities required for this module.
const {grabpost, convertcomment, convertpost} = require('../utils/util');
// third party modules required 


const Comments = require('../controller/comments')
const Posts = require('../controller/posts');

const router = express.Router();

router.get('/posts', Posts.GetAllPosts);
router.get('/newpost', Posts.NewPost);
router.post('/newpost', Posts.CreateNewPost);
router.get('/posts/:id', Posts.GetPostByID)
router.get('/editpost/:id', Posts.EditPostPage);
router.put('/editpost/:id', Posts.EditPost);
router.get('/deletepost/:id', Posts.DeletePost);

module.exports = router;