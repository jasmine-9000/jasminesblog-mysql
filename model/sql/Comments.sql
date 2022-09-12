CREATE DATABASE IF NOT EXISTS MyPosts;
USE MyPosts;

CREATE TABLE IF NOT EXISTS Comments
	( CommentID INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
		OriginPostID INT,
        InnerText VARCHAR(2500),
        AuthorID INT NOT NULL,
        Likes INT,
        Dislikes INT,
        RepliesCount INT,
        DateAdded DATETIME DEFAULT CURRENT_TIMESTAMP, /* Available as of MySQL 5.6.5 */
		DateModified DATETIME ON UPDATE CURRENT_TIMESTAMP, /* Available as of MySQL 5.6.5 */
        CONSTRAINT FK_CommentOriginPostID FOREIGN KEY (OriginPostId ) REFERENCES Posts(PostID) ON DELETE CASCADE,
        CONSTRAINT FK_CommentUserID FOREIGN KEY (AuthorID) REFERENCES Users(UserID)
			);