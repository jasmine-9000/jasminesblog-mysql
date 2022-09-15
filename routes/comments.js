'use strict'

const express = require('express');

const router = express.Router()
const Comments = require('../controller/comments');

router.get('/', Comments.GetAllComments)
router.post('/', Comments.AddComment);
router.get('/:id', Comments.GetCommentsByID)
router.put('/:id', Comments.EditComment);
router.delete('/:id', Comments.DeleteComment);
router.get('/addlike/:id', Comments.GetLikesByID);
router.put('/addlike/:id', Comments.AddLike);
router.put('/adddislike/:id', Comments.AddDislike)

module.exports = router;
