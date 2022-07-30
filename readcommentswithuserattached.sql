USE MyPosts;

SELECT * FROM Comments
INNER JOIN Users ON Users.UserID = Comments.AuthorID