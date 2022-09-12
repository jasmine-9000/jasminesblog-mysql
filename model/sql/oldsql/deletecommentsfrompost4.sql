USE MyPosts;

ALTER TABLE Comments
ADD CONSTRAINT FK_CommentOriginPostID FOREIGN KEY (OriginPostId ) REFERENCES Posts(PostID) ON DELETE CASCADE;


ALTER TABLE Comments
ADD CONSTRAINT FK_CommentUserID FOREIGN KEY (AuthorID) REFERENCES Users(UserID);

#DELETE FROM Comments WHERE Comments.OriginPostID = 4; DELETE FROM Posts WHERE Posts.PostID = 4;

SHOW CREATE TABLE Comments;
/*
ALTER TABLE Comments
DROP FOREIGN KEY comments_ibfk_1;
ALTER TABLE Comments
DROP FOREIGN KEY comments_ibfk_2;
*/