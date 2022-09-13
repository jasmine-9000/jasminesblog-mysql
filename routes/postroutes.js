'use strict'

// get root of app directory with path module.
const {dirname} = require('path');
const appDir = dirname(require.main.filename);

// get mysql connection
const {GetPostById} = require('../model/mysqlconnection');
// get utilities required for this module.
const {grabpost, convertcomment, convertpost} = require('../utils/util');
// third party modules required 
const ejs = require('ejs');
const SqlString = require('sqlstring');

const Comments = require('../controller/comments')
const Posts = require('../controller/posts');




// create the function for '/post/:id'. 
exports.getpost = Posts.GetPostByID;
exports.getallposts = Posts.GetAllPosts;
exports.newpost =  (req, res) => {
    res.sendFile(appDir + '/public/newpost.html');
}
exports.newpost_receive = Posts.CreateNewPost;
exports.editpost = Posts.EditPostPage;
exports.editpost_receive = Posts.EditPost;

exports.deletepost = Posts.DeletePost;