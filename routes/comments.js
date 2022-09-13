'use strict'

const express = require('express');
const router = express.Router()
const Comments = require('../controller/comments');




router.get('/:id', Comments.GetCommentsByID)
router.put('/addlike/:id', Comments.AddLike);
router.get('/addlike/:id', Comments.GetLikesByID);
router.put('/adddislike/:id', Comments.AddDislike)
router.get('/', Comments.GetAllComments)
router.post('/', Comments.AddComment);
router.put('/:id', Comments.EditComment);
router.delete('/:id', Comments.DeleteComment);
module.exports = router;

/*
exports.getcommentbyid = ;

exports.addlike = ;

exports.getlikesbyid = ;

exports.adddislike = ;


exports.getallcomments = ;

exports.addcomment = ;

exports.deletecommentbyid = ;
exports.editcommentbyid = ;
*/