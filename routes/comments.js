'use strict'


const Comments = require('../controller/comments');

exports.getcommentbyid = Comments.GetCommentsByID;

exports.addlike = Comments.AddLike;

exports.getlikesbyid = Comments.GetLikesByID;

exports.adddislike = Comments.AddDislike;


exports.getallcomments = Comments.GetAllComments;

exports.addcomment = Comments.AddComment;

exports.deletecommentbyid = Comments.DeleteComment;
exports.editcommentbyid = Comments.EditComment;